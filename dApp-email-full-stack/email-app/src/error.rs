use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Debug, Copy, Clone, Error)]
pub enum MailError {
	/// Invalid Instruction
	#[error("Invalid Instruction")]
	InvalidInstruction,

	/// Account Is Not Writable
	#[error("Account Is Not Writable")]
	NotWriteable,
}

impl From<MailError> for ProgramError {
	fn from(e: MailError) -> Self {
		ProgramError::Custom(e as u32)
	}
}
