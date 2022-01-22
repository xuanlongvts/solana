use crate::state::{CampaignDetails, WithDrawRequest};
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
			return Self::donate(program_id, accounts);
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
		let writing_account = next_account_info(accounts_iter)?; // account program
		let creator_account = next_account_info(accounts_iter)?; // account of person create program

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
		let accounts_iter = &mut accounts.iter();
		let writing_account = next_account_info(accounts_iter)?; // account program
		let admin_account = next_account_info(accounts_iter)?; // account of person create program

		if writing_account.owner != program_id {
			msg!("writing_account isn't owned by program");
			return Err(ProgramError::IncorrectProgramId);
		}

		if !admin_account.is_signer {
			msg!("admin_account should be singer");
			return Err(ProgramError::IncorrectProgramId);
		}

		let campaign_data = CampaignDetails::try_from_slice(&writing_account.data.borrow())
			.expect("Error deserialaizing data");
		if campaign_data.admin != *admin_account.key {
			msg!("Only the account admin can withdraw");
			return Err(ProgramError::InvalidAccountData);
		}

		let input_data = WithDrawRequest::try_from_slice(&instruction_data)
			.expect("Instruction data serialization didn't worked");

		let rent_exemption = Rent::get()?.minimum_balance(writing_account.data_len());
		if **writing_account.lamports.borrow() - rent_exemption < input_data.amount {
			msg!("Insufficent balance");
			return Err(ProgramError::InsufficientFunds);
		}

		**writing_account.try_borrow_mut_lamports()? -= input_data.amount;
		**admin_account.try_borrow_mut_lamports()? += input_data.amount;

		Ok(())
	}

	fn donate(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
		let accounts_iter = &mut accounts.iter();
		let writing_account = next_account_info(accounts_iter)?; // account program
		let donator_program_account = next_account_info(accounts_iter)?; // donator donate to this account
		let donator = next_account_info(accounts_iter)?; // account of donator

		if writing_account.owner != program_id {
			msg!("writing_account isn't owned by program");
			return Err(ProgramError::IncorrectProgramId);
		}
		if donator_program_account.owner != program_id {
			msg!("donator_program_account isn't owned by program");
			return Err(ProgramError::IncorrectProgramId);
		}
		if !donator.is_signer {
			msg!("donator should be singer");
			return Err(ProgramError::IncorrectProgramId);
		}

		let mut campaign_data = CampaignDetails::try_from_slice(&writing_account.data.borrow())
			.expect("Error deserialaizing data"); // create a tmp campaign_data to save lamports donate
		campaign_data.amount_donated += **donator_program_account.lamports.borrow();

		**writing_account.try_borrow_mut_lamports()? += **donator_program_account.lamports.borrow();
		**donator_program_account.try_borrow_mut_lamports()? = 0;

		campaign_data.serialize(&mut &mut writing_account.data.borrow_mut()[..])?;

		Ok(())
	}
}
