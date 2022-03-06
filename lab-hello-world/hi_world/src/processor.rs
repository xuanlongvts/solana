use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
	account_info::{next_account_info, AccountInfo},
	entrypoint::ProgramResult,
	msg,
	program_error::ProgramError,
	pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreetingAccount {
	pub counter: u32,
}

pub struct Processor;

impl Processor {
	pub fn process_instruction(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		_instruction_data: &[u8],
	) -> ProgramResult {
		msg!("Hello world, this is the first Rust program entrypoint!");

		let acc_iter = &mut accounts.iter();

		let acc = next_account_info(acc_iter)?;
		if acc.owner != program_id {
			msg!("Greeted account does not have the correct program id");
			return Err(ProgramError::IncorrectProgramId);
		}

		let mut greeting_account = GreetingAccount::try_from_slice(&acc.data.borrow())?;
		greeting_account.counter += 1;
		greeting_account.serialize(&mut &mut acc.data.borrow_mut()[..])?;

		msg!("Greeted {} time(s)!", greeting_account.counter);

		Ok(())
	}
}

#[cfg(test)]
mod tests {
	use super::*;
	use solana_program::clock::Epoch;
	use std::mem;

	#[test]
	fn test_sanity() {
		let program_id = Pubkey::default();
		let key = Pubkey::default();
		let mut lamports = 0;
		let mut data = vec![0; mem::size_of::<u32>()];
		let owner = Pubkey::default();

		let acc = AccountInfo::new(
			&key,
			false,
			true,
			&mut lamports,
			&mut data,
			&owner,
			false,
			Epoch::default(),
		);
		let instruction_data: Vec<u8> = Vec::new();

		let accounts = vec![acc];

		assert_eq!(
			GreetingAccount::try_from_slice(&accounts[0].data.borrow())
				.unwrap()
				.counter,
			0
		);

		Processor::process_instruction(&program_id, &accounts, &instruction_data).unwrap();
		assert_eq!(
			GreetingAccount::try_from_slice(&accounts[0].data.borrow())
				.unwrap()
				.counter,
			1
		);

		Processor::process_instruction(&program_id, &accounts, &instruction_data).unwrap();
		assert_eq!(
			GreetingAccount::try_from_slice(&accounts[0].data.borrow())
				.unwrap()
				.counter,
			2
		);
	}
}
