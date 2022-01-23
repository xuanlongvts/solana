use crate::error::MailError::InvalidInstruction;
use crate::state::Email;
use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

#[derive(Debug, PartialEq)]
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

#[cfg(test)]
mod test {
	use super::*;
	use borsh::BorshSerialize;
	use solana_program::{borsh::get_instance_packed_len, pubkey::Pubkey};

	#[test]
	fn test_init_endpoint() {
		let data: Vec<u8> = vec![0];
		let mail_instruction = EMailInstruction::unpack(&data).unwrap();

		assert_eq!(mail_instruction, EMailInstruction::InitAccount);
	}

	#[test]
	fn test_send_endpoint() {
		let test_mail = Email {
			id: String::from("00000000-0000-0000-0000-000000000000"),
			from_address: Pubkey::default().to_string(),
			to_address: Pubkey::default().to_string(),
			subject: String::from("Hey Long"),
			body: String::from("Body text with some character"),
			send_date: String::from("20/10/2021, 09:00:00 am"),
		};

		// exam: data = vec![1, 1, 1, 1, 1, 1] in case get_instance_packed_len = 4;
		/*
			// get_instance_packed_len ===> Ok(n)
			// Ok(2).unwrap() = 2;
			let x: Result<u32, u32> = Ok(2);
			println!("x: {:?}", x.unwrap() + 1); = 3

			let y: Option<usize> = Some(3);
			println!("y: {:?}", y.unwrap() + 1); = 4
		*/
		let mut data: Vec<u8> = vec![1; get_instance_packed_len(&test_mail).unwrap() + 1];
		test_mail.serialize(&mut &mut data[1..]).unwrap();

		let mail_instruction = EMailInstruction::unpack(&data).unwrap();
		assert_eq!(
			mail_instruction,
			EMailInstruction::SendEmail {
				mail: test_mail.clone()
			}
		);

		match mail_instruction {
			EMailInstruction::InitAccount => (),
			EMailInstruction::SendEmail { mail } => {
				assert_eq!(mail.from_address, test_mail.from_address);
				assert_eq!(mail.to_address, test_mail.to_address);
				assert_eq!(mail.subject, test_mail.subject);
				assert_eq!(mail.body, test_mail.body);
			}
		}
	}
}
