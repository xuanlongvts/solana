use std::str::FromStr;
use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
	clock::Clock,
	sysvar::{rent::Rent, Sysvar},
	program_error::ProgramError,
	account_info::{next_account_info, AccountInfo}, pubkey::Pubkey, entrypoint::ProgramResult,
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

	fn process_create_stream(_program_id: &Pubkey, accounts: &[AccountInfo], data: CreateStreamInput) -> ProgramResult {
		const PUBKEY: &str = "DGqXoguiJnAy8ExJe9NuZpWrnQMCV14SdEdiMEdCfpmB";
		let admin_pubkey = match Pubkey::from_str(PUBKEY) {
			Ok(key) => key,
			Err(_) => return Err(StreamError::PubKeyParseError.into())
		};
		let account_infor_iter = &mut accounts.iter();
		let escrow_account = next_account_info(account_infor_iter)?;
		let sender_account = next_account_info(account_infor_iter)?;
		let receiver_account = next_account_info(account_infor_iter)?;
		let admin_account = next_account_info(account_infor_iter)?;

		if *admin_account.key != admin_pubkey {
			return Err(StreamError::AdminAccountInvalid.into());
		}

		if !sender_account.is_signer {
			return Err(ProgramError::MissingRequiredSignature);
		}

		if data.end_time <= data.start_time || data.start_time < Clock::get()?.unix_timestamp {
			return Err(StreamError::InvalidStartOrEndTime.into());
		}

		if *receiver_account.key != data.receiver {
			return Err(ProgramError::InvalidAccountData);
		}

		const TMP_SOL: u64 = 30000000; // 0.03 sol
		**escrow_account.try_borrow_mut_lamports()? -= TMP_SOL;
		**admin_account.try_borrow_mut_lamports()? += TMP_SOL;

		let escrow_account_rest_lamports = **escrow_account.lamports.borrow() - Rent::get()?.minimum_balance(escrow_account.data_len());
		let amount_pay_save = data.amount_second * (data.end_time - data.start_time) as u64;
		if amount_pay_save != escrow_account_rest_lamports {
			return Err(StreamError::NotEnoughLamports.into());
		}

		let escrow_data = StreamData::new(data, *sender_account.key);
		escrow_data.serialize(&mut &mut escrow_account.data.borrow_mut()[..])?;

		Ok(())
	}

	fn process_withdraw(_program_id: &Pubkey, accounts: &[AccountInfo], data: WithdrawInput) -> ProgramResult {
		let account_into_iter = &mut accounts.iter();
		let escrow_account = next_account_info(account_into_iter)?;
		let receiver_account = next_account_info(account_into_iter)?;

		let mut escrow_data = StreamData::try_from_slice(&escrow_account.data.borrow()).expect("Failed to serialize escrow data");
		if *receiver_account.key != escrow_data.receiver {
			return Err(ProgramError::IllegalOwner);
		}

		if !receiver_account.is_signer {
			return Err(ProgramError::MissingRequiredSignature);
		}

		let time = Clock::get()?.unix_timestamp;
		let left_lamports = escrow_data.amount_second * ((std::cmp::min(time, escrow_data.end_time) - escrow_data.start_time) as u64);
		let total_token_owned = left_lamports - escrow_data.lamports_withdrawn;

		if data.amount > total_token_owned {
            return Err(StreamError::WithdrawError.into());
        }

		**escrow_account.try_borrow_mut_lamports()? -= data.amount;
		**receiver_account.try_borrow_mut_lamports()? += data.amount;

		escrow_data.lamports_withdrawn += data.amount;
		
		escrow_data.serialize(&mut &mut escrow_account.data.borrow_mut()[..])?;

		Ok(())
	}

	fn process_close(_program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
		let account_into_iter = &mut accounts.iter();
		let escrow_account = next_account_info(account_into_iter)?;
		let sender_account = next_account_info(account_into_iter)?;
		let receiver_account = next_account_info(account_into_iter)?;

		let mut escrow_data = StreamData::try_from_slice(&escrow_account.data.borrow()).expect("Faile to serialize escrow data");

		if escrow_data.sender != *sender_account.key {
			return Err(ProgramError::IllegalOwner);
		}

		if !sender_account.is_signer {
			return Err(ProgramError::MissingRequiredSignature);
		}

		let time: i64 = Clock::get()?.unix_timestamp;
		let mut lamport_streamed_to_receiver: u64 = 0;

		if time > escrow_data.start_time {
			let left_lamports = escrow_data.amount_second * ((std::cmp::min(time, escrow_data.end_time) - escrow_data.start_time) as u64);
			lamport_streamed_to_receiver = left_lamports  - escrow_data.lamports_withdrawn;
		}

		**receiver_account.try_borrow_mut_lamports()? += lamport_streamed_to_receiver;
		escrow_data.lamports_withdrawn += lamport_streamed_to_receiver;
		**sender_account.try_borrow_mut_lamports()? += **escrow_account.lamports.borrow();

		**escrow_account.try_borrow_mut_lamports()? = 0;

		Ok(())
	}
}