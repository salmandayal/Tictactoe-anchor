use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;

declare_id!("3kK4ni8Z9TdjTz87HWcpG8ps9Ps29GpWAz7mJtWEKQfa");

#[program]
pub mod tic_tac_toc {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct Game {
    //Players
    players: [Pubkey; 2],
    game_state: GameState,
    turn: u8,
    board: [[Option<Sign>; 3]; 3],
    //GameState
    //Board 3x3
    //Turn
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    Active,
    Tie,
    Won { winner: Pubkey },
}

#[derive(
    AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, FromPrimitive, ToPrimitive,
)]
pub enum Sign {
    X,
    O,
}
