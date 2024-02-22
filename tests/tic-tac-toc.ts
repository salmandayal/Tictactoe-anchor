import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicTacToc } from "../target/types/tic_tac_toc";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { expect } from "chai";

describe("tic-tac-toc", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TicTacToc as Program<TicTacToc>;

  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });
  it("setup game!", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .initialize(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    let gameState = await program.account.game.fetch(gameKeypair.publicKey);
    expect(gameState.turn).to.equal(1);
    expect(gameState.players).to.eql([
      playerOne.publicKey,
      playerTwo.publicKey,
    ]);
    expect(gameState.state).to.eql({ active: {} });
    expect(gameState.board).to.eql([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });

  it("play game!", async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const playerOne = (program.provider as anchor.AnchorProvider).wallet;
    const playerTwo = anchor.web3.Keypair.generate();
    await program.methods
      .initialize(playerTwo.publicKey)
      .accounts({
        game: gameKeypair.publicKey,
        playerOne: playerOne.publicKey,
      })
      .signers([gameKeypair])
      .rpc();

    await program.methods
      .play({ row: 0, column: 0 })
      .accounts({ game: gameKeypair.publicKey, player: playerTwo.publicKey })
      .signers(playerTwo instanceof (anchor.Wallet as any) ? [] : [playerTwo])
      .rpc();

    let gameAccount = await program.account.game.fetch(gameKeypair.publicKey);
    console.log(gameAccount);
  });
});
