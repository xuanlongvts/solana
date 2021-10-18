use crate::error::MailError::InvalidInstruction;
use solana_program::program_error::ProgramError;

#[derive(Debug)]
pub enum EMailInstruction {
	InitAccount,
}

impl EMailInstruction {
	pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
		let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
		Ok(match tag {
			0 => Self::InitAccount,
			_ => return Err(InvalidInstruction.into()),
			// [73, 110, 118, 97, 108, 105, 100, 32, 73, 110, 115, 116, 114, 117, 99, 116, 105, 111, 110] ~ "Invalid Instruction" from error
		})
	}
}
