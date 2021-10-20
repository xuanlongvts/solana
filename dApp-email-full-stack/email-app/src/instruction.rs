use crate::error::MailError::InvalidInstruction;
use crate::state::Email;
use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

#[derive(Debug)]
pub enum EMailInstruction {
	InitAccount,               // init account
	SendEmail { mail: Email }, // AccountInfo for sender, receiver
}

impl EMailInstruction {
	pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
		let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
		Ok(match tag {
			0 => Self::InitAccount,
			1 => Self::SendEmail {
				mail: Email::try_from_slice(&rest)?,
			},
			_ => return Err(InvalidInstruction.into()),
		})
	}
}
