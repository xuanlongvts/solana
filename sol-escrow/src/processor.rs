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
		);

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
		Ok(())
	}
}
