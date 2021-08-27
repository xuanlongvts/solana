use borsh::BorshDeserialize;
use dapp::{process_instruction, GreetingAccount};
use solana_program_test::*;
use solana_sdk::{
	account::Account,
	instruction::{AccountMeta, Instruction},
	pubkey::Pubkey,
	signature::Signer,
	transaction::Transaction,
};
use std::mem;

#[tokio::test]
async fn test_helloworld() {
	let program_id = Pubkey::new_unique();
	let greeted_pubkey = Pubkey::new_unique();
	let mut program_test =
		ProgramTest::new("hellow-dapp", program_id, processor!(process_instruction));
	program_test.add_account(
		greeted_pubkey,
		Account {
			lamports: 5,
			data: vec![0_u8; mem::size_of::<u32>()],
			owner: program_id,
			..Account::default()
		},
	);
	let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

	// Verify account has zero greetings
	let greeted_account = banks_client
		.get_account(greeted_pubkey)
		.await
		.expect("get_account")
		.expect("greeted_account not found");

	assert_eq!(
		GreetingAccount::try_from_slice(&greeted_account.data)
			.unwrap()
			.counter,
		0
	);

	// Greet once
	let instr_new_bin = Instruction::new_with_bincode(
		program_id,
		&[0],
		vec![AccountMeta::new(greeted_pubkey, false)],
	);
	let mut transaction = Transaction::new_with_payer(&[instr_new_bin], Some(&payer.pubkey()));
	transaction.sign(&[&payer], recent_blockhash);
	banks_client.process_transaction(transaction).await.unwrap();

	// Verify account has one greeting
	let greeted_account = banks_client
		.get_account(greeted_pubkey)
		.await
		.expect("get_account")
		.expect("greeted_account not found");

	assert_eq!(
		GreetingAccount::try_from_slice(&greeted_account.data)
			.unwrap()
			.counter,
		1
	);
	let instr_new_bin = Instruction::new_with_bincode(
		program_id,
		&[1],
		vec![AccountMeta::new(greeted_pubkey, false)],
	);
	let mut transaction = Transaction::new_with_payer(&[instr_new_bin], Some(&payer.pubkey()));
	transaction.sign(&[&payer], recent_blockhash);
	banks_client.process_transaction(transaction).await.unwrap();

	// Verify account has two greeting
	let greeted_account = banks_client
		.get_account(greeted_pubkey)
		.await
		.expect("get_account")
		.expect("greeted_account not found");

	assert_eq!(
		GreetingAccount::try_from_slice(&greeted_account.data)
			.unwrap()
			.counter,
		2
	);
}
