use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod o5_vote_pda {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, vote_acc_bump: u8) -> Result<()> {
        ctx.accounts.vote_acc.bump = vote_acc_bump;
        Ok(())
    }

    pub fn vote_pizza(ctx: Context<Vote>) -> Result<()> {
        ctx.accounts.vote_acc.pizza += 1;
        Ok(())
    }

    pub fn vote_hambuger(ctx: Context<Vote>) -> Result<()> {
        ctx.accounts.vote_acc.hambuger += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut, seeds = [b"seed_word".as_ref()], bump = vote_acc.bump)]
    vote_acc: Account<'info, VotingState>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, seeds = [b"seed_word".as_ref()], bump, space = 8 + 8 + 8 + 1)]
    pub vote_acc: Account<'info, VotingState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VotingState {
    pub pizza: u64,
    pub hambuger: u64,
    pub bump: u8,
}
