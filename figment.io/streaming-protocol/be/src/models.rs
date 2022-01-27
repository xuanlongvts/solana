use crate::diesel::ExpressionMethods;
use borsh::{BorshDeserialize, BorshSerialize};
use diesel::{Insertable, PgConnection, QueryDsl, Queryable, RunQueryDsl};
use serde::Serialize;
use solana_sdk::{clock::UnixTimestamp, pubkey::Pubkey};

use crate::schema::tbl_streams;

#[derive(Debug, Clone, PartialEq, BorshDeserialize, BorshSerialize)]
struct StreamData {
	pub start_time: UnixTimestamp,
	pub end_time: UnixTimestamp,
	pub receiver: Pubkey,
	pub lamports_withdrawn: u64,
	pub amount_second: u64,
	pub sender: Pubkey,
}

#[derive(Queryable, Insertable, Serialize)]
#[table_name = "tbl_streams"]
pub struct Stream {
	pub pda_account: String,
	pub start_time: i64,
	pub end_time: i64,
	pub receiver: String,
	pub lamports_withdrawn: i64,
	pub amount_second: i64,
	pub sender: String,
	pub total_amount: i64,
}

impl Stream {
	pub fn new(pda_pubkey: String, pda_data: &Vec<u8>) -> Option<Self> {
		let stream_data = match StreamData::try_from_slice(pda_data) {
			Ok(item) => item,
			Err(err) => {
				println!(
					"Failed to deserialize {} with error {:?}",
					pda_pubkey.to_string(),
					err
				);
				return None;
			}
		};

		let StreamData {
			start_time,
			end_time,
			receiver,
			lamports_withdrawn,
			amount_second,
			sender,
		} = stream_data;

		Some(Stream {
			start_time,
			end_time,
			receiver: receiver.to_string(),
			lamports_withdrawn: lamports_withdrawn as i64,
			amount_second: amount_second as i64,
			sender: sender.to_string(),
			pda_account: pda_pubkey,
			total_amount: (end_time - start_time) * amount_second as i64,
		})
	}

	pub fn get_all_with_sender(pubkey: &String, conn: &PgConnection) -> Vec<Stream> {
		use crate::schema::tbl_streams::dsl::*;
		tbl_streams
			.filter(sender.eq(pubkey))
			.load::<Stream>(conn)
			.unwrap()
	}

	pub fn get_all_with_receiver(pubkey: &String, conn: &PgConnection) -> Vec<Stream> {
		use crate::schema::tbl_streams::dsl::*;
		tbl_streams
			.filter(receiver.eq(pubkey))
			.load::<Stream>(conn)
			.unwrap()
	}

	pub fn id_is_present(id: &String, conn: &PgConnection) -> bool {
		use crate::schema::tbl_streams::dsl::*;
		match tbl_streams.find(id).first::<Stream>(conn) {
			Ok(_s) => true,
			_ => false,
		}
	}

	pub fn insert_or_update(stream: Stream, conn: &PgConnection) -> bool {
		if Stream::id_is_present(&stream.pda_account, conn) {
			use crate::schema::tbl_streams::dsl::{
				amount_second as a_s, end_time as e_t, lamports_withdrawn as l_w,
				pda_account as p_a, receiver as r, sender as s, tbl_streams, total_amount as t_a,
			};
			diesel::update(tbl_streams.filter(p_a.eq(stream.pda_account)))
				.set((
					a_s.eq(stream.amount_second),
					r.eq(stream.receiver),
					s.eq(stream.sender),
					l_w.eq(stream.lamports_withdrawn),
					t_a.eq(stream.total_amount),
					e_t.eq(stream.end_time),
				))
				.execute(conn)
				.is_ok()
		} else {
			diesel::insert_into(crate::schema::tbl_streams::table)
				.values(&stream)
				.execute(conn)
				.is_ok()
		}
	}
}
