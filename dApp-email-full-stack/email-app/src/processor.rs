use crate::instruction::EMailInstruction;
use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, msg, pubkey::Pubkey};

pub struct Processor;

impl Processor {
	pub fn process(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		let instruction = EMailInstruction::unpack(instruction_data)?;

		match instruction {
			EMailInstruction::InitAccount => {
				msg!("Instruction: InitAccount");
				Self::process_init_account(accounts, program_id)
			}
		}
	}

	fn process_init_account(account: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
		Ok(())
	}
}
