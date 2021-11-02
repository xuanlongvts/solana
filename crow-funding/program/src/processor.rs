use crate::state::CampaignDetails;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
	account_info::{next_account_info, AccountInfo},
	entrypoint::ProgramResult,
	msg,
	program_error::ProgramError,
	pubkey::Pubkey,
	rent::Rent,
	sysvar::Sysvar,
};

pub struct Processor;

impl Processor {
	pub fn process(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		if instruction_data.len() == 0 {
			return Err(ProgramError::InvalidInstructionData);
		}

		let len_struction = instruction_data.len();

		if instruction_data[0] == 0 {
			return Self::create_campaign(
				program_id,
				accounts,
				&instruction_data[1..len_struction],
			);
		} else if instruction_data[0] == 1 {
			return Self::withdraw(program_id, accounts, &instruction_data[1..len_struction]);
		} else if instruction_data[0] == 2 {
			return Self::donate(program_id, accounts, &instruction_data[1..len_struction]);
		}

		msg!("Didn't found the entrypoint required");
		Err(ProgramError::InvalidInstructionData)
	}

	fn create_campaign(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		let accounts_iter = &mut accounts.iter();
		let writing_account = next_account_info(accounts_iter)?;
		let creator_account = next_account_info(accounts_iter)?;

		if writing_account.owner != program_id {
			msg!("writing_account isn't owned by program");
			return Err(ProgramError::IncorrectProgramId);
		}
		if !creator_account.is_signer {
			msg!("creator_account should be singer");
			return Err(ProgramError::IncorrectProgramId);
		}

		let mut input_data = CampaignDetails::try_from_slice(&instruction_data)
			.expect("Instruction data serialization didn't worked");
		if input_data.admin != *creator_account.key {
			msg!("Invalid instruction data");
			return Err(ProgramError::InvalidInstructionData);
		}
		let rent_exemption = Rent::get()?.minimum_balance(writing_account.data_len());

		if **writing_account.lamports.borrow() < rent_exemption {
			msg!("The balance of writing_account should be more than rent_exemption");
			return Err(ProgramError::InsufficientFunds);
		}
		input_data.amount_donated = 0;
		input_data.serialize(&mut &mut writing_account.try_borrow_mut_data()?[..])?;

		Ok(())
	}

	fn withdraw(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		Ok(())
	}

	fn donate(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		Ok(())
	}
}
