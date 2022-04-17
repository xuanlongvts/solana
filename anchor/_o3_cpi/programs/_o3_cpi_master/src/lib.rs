use anchor_lang::prelude::*;

use o3_cpi::cpi::accounts::SetData;
use o3_cpi::{self, Data};
use o3_cpi::program::O3Cpi; // pub mod o3_cpi  ---> O3Cpi

declare_id!("HmbTLCmaGvZhKnn1Zfa1JVnp7vkMV4DYVxPLWBVoN65L");

#[program]
pub mod o3_cpi_master {
    use super::*;

    pub fn pull_strings(ctx: Context<PullStrings>, data: u64) -> Result<()> {
        let cpi_program = ctx.accounts.puppet_program.to_account_info();
        let cpi_accounts = SetData {
            puppet: ctx.accounts.puppet.to_account_info()
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        o3_cpi::cpi::set_data(cpi_ctx, data)
    }
}

#[derive(Accounts)]
pub struct PullStrings<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, O3Cpi>
}
