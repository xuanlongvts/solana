use solana_program::{
	account_info::{next_account_info, AccountInfo},
	entrypoint::ProgramResult,
	msg,
	program::{invoke, invoke_signed},
	program_error::ProgramError,
	program_pack::{IsInitialized, Pack},
	pubkey::Pubkey,
	sysvar::{rent::Rent, Sysvar},
};

use spl_token::state::Account as TokenAccount;

use crate::{error::EscrowError, instruction::EscrowInstruction, state::Escrow};

pub struct Processor;

impl Processor {
	pub fn processor(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		let instruction = EscrowInstruction::unpack(instruction_data)?;

		match instruction {
			EscrowInstruction::InitEscrow { amount } => {
				msg!("Instruction: InitEscrow");
				Self::process_init_escrow(accounts, amount, program_id)
			}
			EscrowInstruction::Exchange { amount } => {
				msg!("Instruction: Exchange");
				Self::process_exchange(accounts, amount, program_id)
			}
		}
	}

	fn process_init_escrow(
		accounts: &[AccountInfo],
		amount: u64,
		program_id: &Pubkey,
	) -> ProgramResult {
		let account_iter = &mut accounts.iter();
		let acc_initializer = next_account_info(account_iter)?;
		if !acc_initializer.is_signer {
			return Err(ProgramError::MissingRequiredSignature);
		}

		let acc_temp_token = next_account_info(account_iter)?;

		let acc_token_receive = next_account_info(account_iter)?;
		if *acc_token_receive.owner != spl_token::id() {
			return Err(ProgramError::IncorrectProgramId);
		}

		let acc_escrow = next_account_info(account_iter)?;
		let rent = &Rent::from_account_info(next_account_info(account_iter)?)?;
		if !rent.is_exempt(acc_escrow.lamports(), acc_escrow.data_len()) {
			return Err(EscrowError::NotRentExempt.into());
		}

		let mut escrow_info = Escrow::unpack_unchecked(&acc_escrow.try_borrow_data()?)?;
		if escrow_info.is_initialized() {
			return Err(ProgramError::AccountAlreadyInitialized);
		}
		escrow_info.is_initialized = true;
		escrow_info.initializer_pubkey = *acc_initializer.key;
		escrow_info.temp_token_account_pubkey = *acc_temp_token.key;
		escrow_info.initializer_token_to_receive_account_pubkey = *acc_token_receive.key;
		escrow_info.expected_amount = amount;

		Escrow::pack(escrow_info, &mut acc_escrow.try_borrow_mut_data()?)?;
		let (pda, _nonce) = Pubkey::find_program_address(&[b"escrow"], program_id);

		let token_program = next_account_info(account_iter)?;
		let owner_change_ix = spl_token::instruction::set_authority(
			token_program.key,
			acc_temp_token.key,
			Some(&pda),
			spl_token::instruction::AuthorityType::AccountOwner,
			acc_initializer.key,
			&[&acc_initializer.key],
		)?;

		msg!("Calling the token program to transfer token account ownership...");
		invoke(
			&owner_change_ix,
			&[
				acc_temp_token.clone(),
				acc_initializer.clone(),
				token_program.clone(),
			],
		)?;

		Ok(())
	}

	fn process_exchange(
		accounts: &[AccountInfo],
		amount_expected_by_taker: u64,
		program_id: &Pubkey,
	) -> ProgramResult {
		let account_iter = &mut accounts.iter();

		let acc_taker = next_account_info(account_iter)?;
		if !acc_taker.is_signer {
			return Err(ProgramError::MissingRequiredSignature);
		}

		let acc_takers_sending_token = next_account_info(account_iter)?;
		let acc_takers_token_to_receive = next_account_info(account_iter)?;

		let acc_pdas_temp_token = next_account_info(account_iter)?;
		let acc_pdas_temp_token_info =
			TokenAccount::unpack(&acc_pdas_temp_token.try_borrow_data()?)?;
		let (pda, nonce) = Pubkey::find_program_address(&[b"escrow"], program_id);

		if amount_expected_by_taker != acc_pdas_temp_token_info.amount {
			return Err(EscrowError::ExpectedAmountMismatch.into());
		}

		let acc_initializers_main = next_account_info(account_iter)?;
		let acc_initializers_token_to_receive = next_account_info(account_iter)?;

		let acc_escrow = next_account_info(account_iter)?;
		let escrow_info = Escrow::unpack(&acc_escrow.try_borrow_data()?)?;
		if escrow_info.temp_token_account_pubkey != *acc_pdas_temp_token.key {
			return Err(ProgramError::InvalidAccountData);
		}

		if escrow_info.initializer_pubkey != *acc_initializers_main.key {
			return Err(ProgramError::InvalidAccountData);
		}

		if escrow_info.initializer_token_to_receive_account_pubkey
			!= *acc_initializers_token_to_receive.key
		{
			return Err(ProgramError::InvalidAccountData);
		}

		let token_program = next_account_info(account_iter)?;
		let transfer_to_initializer_ix = spl_token::instruction::transfer(
			token_program.key,
			acc_takers_sending_token.key,
			acc_initializers_token_to_receive.key,
			acc_taker.key,
			&[&acc_taker.key],
			escrow_info.expected_amount,
		)?;
		msg!("Calling the token program to transfer tokens to the escrow's initializer...");
		invoke(
			&transfer_to_initializer_ix,
			&[
				acc_takers_sending_token.clone(),
				acc_initializers_token_to_receive.clone(),
				acc_taker.clone(),
				token_program.clone(),
			],
		)?;

		let acc_pda = next_account_info(account_iter)?;
		let transfer_to_taker_ix = spl_token::instruction::transfer(
			token_program.key,
			acc_pdas_temp_token.key,
			acc_takers_token_to_receive.key,
			&pda,
			&[&pda],
			acc_pdas_temp_token_info.amount,
		)?;
		msg!("Calling the token program to transfer tokens to the taker...");
		invoke_signed(
			&transfer_to_taker_ix,
			&[
				acc_pdas_temp_token.clone(),
				acc_takers_token_to_receive.clone(),
				acc_pda.clone(),
				token_program.clone(),
			],
			&[&[&b"escrow"[..], &[nonce]]],
		)?;

		msg!("Closing the escrow account...");
		**acc_initializers_main.try_borrow_mut_lamports()? = acc_initializers_main
			.lamports()
			.checked_add(acc_escrow.lamports())
			.ok_or(EscrowError::AmountOverflow)?;
		**acc_escrow.try_borrow_mut_lamports()? = 0;
		*acc_escrow.try_borrow_mut_data()? = &mut [];

		Ok(())
	}
}
