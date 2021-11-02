use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct CampaignDetails {
	pub admin: Pubkey,
	pub name: String,
	pub description: String,
	pub image_link: String,
	pub amount_donated: u64,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct WithDrawRequest {
	pub amount: u64,
}
