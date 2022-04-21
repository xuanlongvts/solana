use anchor_lang::prelude::*;

use crate::errors::TicTacToeError;
use num_derive::*;
use num_traits::*;

#[derive(
	AnchorDeserialize, AnchorSerialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq, Debug
)]
pub enum Sign {
	X,
	O,
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, Eq)]
pub enum GameState {
	Active,
	Tie, // hoà
	Won { winner: Pubkey },
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct Tile {
	row: u8,
	column: u8,
}

/*
Tic-tac-toe: https://vi.wikipedia.org/wiki/Tic-tac-toe

- Pubkey has a length of 32 bytes so 2 * 32 = 64
- u8 as a vector has a length of 1
- The board has a length of (9 * (1 + 1)). We know the board has 9 tiles (-> 9) of type Option which borsh serializes with 1 byte
	(set to 1 for Some and 0 for None) plus the size of whatever's in the Option.
	In this case, it's a simple enum with types that don't hold more types so the maximum size of the enum is also just 1
	(for its discriminant). In total that means we get 9 (tiles) * (1 (Option) + 1(Sign discriminant)).
- State is also an enum so we need 1 byte for the discriminant.
	We have to init the account with the maximum size and the maximum size of an enum is the size of its biggest variant.
	In this case that's the winner variant which holds a Pubkey.
	A Pubkey is 32 bytes long so the size of state is 1 (discriminant) + 32 (winner pubkey)
	(MAXIMUM_SIZE is a const variable so specifying it in terms of a sum of the sizes of Game's members' fields does not incur any runtime cost).
*/

#[account]
pub struct Game {
	players: [Pubkey; 2],          // (32 * 2)
	turn: u8,                      // 1
	board: [[Option<Sign>; 3]; 3], // 9 * (1 + 1) = 18
	state: GameState,              // 32 + 1
}

impl Game {
	pub const MAX_SIZE: usize = (32 * 2) + 1 + (9 * (1 + 1)) + (32 + 1);

	pub fn start(&mut self, players: [Pubkey; 2]) -> Result<()> {
		require_eq!(self.turn, 0, TicTacToeError::GameAlreadyStarted);
		self.players = players;
		self.turn = 1;

		Ok(())
	}

	pub fn is_active(&self) -> bool {
		self.state == GameState::Active
	}

	pub fn current_player_index(&self) -> usize {
		((self.turn - 1) % 2) as usize // 0 or 1
	}

	pub fn current_player(&self) -> Pubkey {
		self.players[self.current_player_index()]
	}

	pub fn play(&mut self, tile: &Tile) -> Result<()> {
		require!(self.is_active(), TicTacToeError::GameAlreayOver);

		match tile {
			tile @ Tile {
				row: 0..=2,
				column: 0..=2,
			} => match self.board[tile.row as usize][tile.column as usize] {
				Some(_) => return Err(TicTacToeError::TileAlreadySet.into()),
				None => {
					self.board[tile.row as usize][tile.column as usize] =
						Some(Sign::from_usize(self.current_player_index()).unwrap());

					// Sign::from_usize(self.current_player_index()).unwrap() ===> { x: {}} or { o: {}}
				}
			},
			_ => return Err(TicTacToeError::TileOutOfBounds.into()),
		}

		self.update_state();

		if GameState::Active == self.state {
			self.turn += 1;
		}

		Ok(())
	}

	fn is_winning_trio(&self, trio: [(usize, usize); 3]) -> bool {
		let [first, second, third] = trio;

		let get_value_1x1 = self.board[first.0][first.1].is_some(); // true or false
		get_value_1x1
			&& self.board[first.0][first.1] == self.board[second.0][second.1]
			&& self.board[first.0][first.1] == self.board[third.0][third.1]
	}

	fn update_state(&mut self) {
		for i in 0..=2 {
			// three of the same row
			if self.is_winning_trio([(i, 0), (i, 1), (i, 2)]) {
				self.state = GameState::Won {
					winner: self.current_player(),
				};
				return;
			}

			// three of the same column
			if self.is_winning_trio([(0, i), (1, i), (2, i)]) {
				self.state = GameState::Won {
					winner: self.current_player(),
				};
				return;
			}

			// three of the same in on diagonal
			if self.is_winning_trio([(0, 0), (1, 1), (2, 2)])
				|| self.is_winning_trio([(0, 2), (1, 1), (2, 0)])
			{
				self.state = GameState::Won {
					winner: self.current_player(),
				};
				return;
			}

			// reaching this code means the game has not been won,
			// so if there are unfilled tiles left, it's still active
			for row in 0..=2 {
				for col in 0..=2 {
					if self.board[row][col].is_none() {
						return;
					}
				}
			}
			// game has not been won
			// game has no more free tiles
			// -> game ends in a tie
			self.state = GameState::Tie;
		}
	}
}
