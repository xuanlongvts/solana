use solana_program::{
	account_info::{next_account_info, AccountInfo},
	entrypoint::ProgramResult,
	program::invoke_signed,
	program_error::ProgramError,
	pubkey::Pubkey,
	system_instruction,
};

/// Amount of bytes of account data to allocate
pub const SIZE: usize = 42;

pub fn processor_instruction(
	program_id: &Pubkey,
	accounts: &[AccountInfo],
	instruction_data: &[u8],
) -> ProgramResult {
	let account_info_iter = &mut accounts.iter();

	// Account info for the program being invoked
	let system_program_info = next_account_info(account_info_iter)?;

	// Account info to allocate
	let allocated_info = next_account_info(account_info_iter)?;

	let expected_allocated_key =
		Pubkey::create_program_address(&[b"You pass butter", &[instruction_data[0]]], program_id)?;

	if *allocated_info.key != expected_allocated_key {
		return Err(ProgramError::InvalidArgument);
	}

	// Invoke the system program to allocate account data
	invoke_signed(
		&system_instruction::allocate(allocated_info.key, SIZE as u64),
		&[system_program_info.clone(), allocated_info.clone()],
		&[&[b"You pass butter", &[instruction_data[0]]]],
	)?;

	Ok(())
}
