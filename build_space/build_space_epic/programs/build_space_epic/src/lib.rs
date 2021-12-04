use anchor_lang::prelude::*;

declare_id!("8ixv5FpQEV9MpHMpD3xZP8ttC8BFpRory2M8BHfxVXmH");

#[program]
pub mod build_space_epic {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        // Get a reference to the account.
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *base_account.to_account_info().key,
            votes: Votes {
                pubkeys: Vec::new(),
                likes: 0
            }
        };

        base_account.gif_list.push(item);
        base_account.total_gifs += 1;

        Ok(())
    }

    pub fn update_votes(ctx: Context<UpdateInfor>, gif_link: String, pubkey: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        let find_index = base_account.gif_list.iter().position(|x| x.gif_link == gif_link);

        if find_index != None {
            let i = find_index.unwrap();
            // let item = Votes {
            //     pubkeys: vec![String::from("1"), String::from("2")],
            //     likes: 100
            // };
            // base_account.gif_list[i].votes.push(item);

            // gif_list: [
            //     {
            //         gif_link: "aaa",
            //         user_address: "bbb",
            //         votes: {
            //             pubkeys: [], likes: 0
            //         }
            //     }
            // ];
            let find_index_pubkey = base_account.gif_list[i].votes.pubkeys.iter().position(|x| x == &pubkey);
            if find_index_pubkey == None {
                base_account.gif_list[i].votes.pubkeys.push(pubkey);
                base_account.gif_list[i].votes.likes += 1;
            } else {
                base_account.gif_list[i].votes.pubkeys.remove(find_index_pubkey.unwrap());
                base_account.gif_list[i].votes.likes -= 1;
            }
        }

        Ok(())
    }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub votes: Votes
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Votes {
    pubkeys: Vec<String>,
    likes: u32
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

#[derive(Accounts)]
pub struct UpdateInfor<'info>{
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}