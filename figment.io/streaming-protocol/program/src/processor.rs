use solana_program::{
	account_info::AccountInfo, pubkey::Pubkey, entrypoint::ProgramResult
};

use crate::{
	error::StreamError,
	instruction::StreamInstruction,
	state::{CreateStreamInput, StreamData, WithdrawInput}
};

pub struct Processor;

impl Processor {
	pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
		let instruction = StreamInstruction::unpack(instruction_data)?;
		match instruction {
			StreamInstruction::CreateStream(data) => Self::process_create_stream(program_id, accounts, data),
			StreamInstruction::WithdrawFromStream(data) => Self::process_withdraw(program_id, accounts, data),
			StreamInstruction::CloseStream => Self::process_close(program_id, accounts)
		}
	}

	fn process_create_stream(program_id: &Pubkey, accounts: &[AccountInfo], data: CreateStreamInput) -> ProgramResult {

		Ok(())
	}

	fn process_withdraw(program_id: &Pubkey, accounts: &[AccountInfo], data: WithdrawInput) -> ProgramResult {

		Ok(())
	}

	fn process_close(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {

		Ok(())
	}
}