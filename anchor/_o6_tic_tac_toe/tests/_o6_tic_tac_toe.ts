import * as anchor from "@project-serum/anchor";
import { AnchorError, Program } from "@project-serum/anchor";
import chai, { expect } from "chai";

import { O6TicTacToe } from "../target/types/o6_tic_tac_toe";

describe("_o6_tic_tac_toe", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.O6TicTacToe as Program<O6TicTacToe>;
    const programProvider = program.provider as anchor.AnchorProvider;

    const init = async (): Promise<{
        gamePubkey: anchor.web3.PublicKey;
        playerOne: anchor.Wallet;
        playerTwo: anchor.web3.Keypair;
    }> => {
        const gameKeypair = anchor.web3.Keypair.generate();
        const playerOne = programProvider.wallet;
        const playerTwo = anchor.web3.Keypair.generate();

        await program.methods
            .setupGame(playerTwo.publicKey)
            .accounts({
                game: gameKeypair.publicKey,
                playerOne: playerOne.publicKey,
            })
            .signers([gameKeypair])
            .rpc();

        let gameState = await program.account.game.fetch(gameKeypair.publicKey);
        // console.log("gameState.turn: ", gameState.turn);
        expect(gameState.turn).to.equal(1);

        // Target object is deeply (but not strictly) equal to {a: 1}
        // expect({ a: 1 }).to.eql({ a: 1 }).but.not.equal({ a: 1 });
        expect(gameState.players).to.eql([
            playerOne.publicKey,
            playerTwo.publicKey,
        ]);
        expect(gameState.state).to.eql({
            active: {},
        });
        expect(gameState.board).to.eql([
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]);

        return {
            gamePubkey: gameKeypair.publicKey,
            playerOne: playerOne as anchor.Wallet,
            playerTwo: playerTwo,
        };
    };

    it("Setup game!", async () => {
        await init();
    });

    const play = async (
        gamePubkey,
        player,
        tile,
        expectedTurn,
        expectedGameState,
        expectedBoard
    ) => {
        // console.log("player: ", player);
        // console.log("anchor.Wallet as any: ---> ", anchor.Wallet as any);

        await program.methods
            .play(tile)
            .accounts({
                game: gamePubkey,
                player: player.publicKey,
            })
            .signers(player instanceof (anchor.Wallet as any) ? [] : [player]) // if playerOne then nothing sign
            .rpc();
        const gameState = await program.account.game.fetch(gamePubkey);
        expect(gameState.turn).to.equal(expectedTurn);
        expect(gameState.state).to.eql(expectedGameState);
        expect(gameState.board).to.eql(expectedBoard);
    };

    it("player one wins!", async () => {
        const { gamePubkey, playerOne, playerTwo } = await init();

        await play(
            gamePubkey,
            playerOne,
            { row: 0, column: 0 },
            2,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [null, null, null],
                [null, null, null],
            ]
        );

        try {
            await play(
                gamePubkey,
                playerOne,
                { row: 1, column: 0 },
                2,
                {
                    active: {},
                },
                [
                    [{ x: {} }, null, null],
                    [null, null, null],
                    [null, null, null],
                ]
            );
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("NotPlayersTurn");
            expect(err.error.errorCode.number).to.equal(6003);
            expect(err.program.equals(program.programId)).is.true;
            expect(err.error.comparedValues).to.deep.equal([
                playerTwo.publicKey,
                playerOne.publicKey,
            ]);
        }

        await play(
            gamePubkey,
            playerTwo,
            { row: 1, column: 0 },
            3,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [{ o: {} }, null, null],
                [null, null, null],
            ]
        );

        await play(
            gamePubkey,
            playerOne,
            { row: 0, column: 1 },
            4,
            {
                active: {},
            },
            [
                [{ x: {} }, { x: {} }, null],
                [{ o: {} }, null, null],
                [null, null, null],
            ]
        );

        try {
            await play(
                gamePubkey,
                playerTwo,
                { row: 3, column: 1 }, // out of bounds row
                4,
                {
                    active: {},
                },
                [
                    [{ x: {} }, { x: {} }, null],
                    [{ o: {} }, null, null],
                    [null, null, null],
                ]
            );
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("TileOutOfBounds");
            expect(err.error.errorCode.number).to.equal(6000);
        }

        await play(
            gamePubkey,
            playerTwo,
            { row: 1, column: 1 },
            5,
            {
                active: {},
            },
            [
                [{ x: {} }, { x: {} }, null],
                [{ o: {} }, { o: {} }, null],
                [null, null, null],
            ]
        );

        try {
            await play(
                gamePubkey,
                playerOne,
                { row: 0, column: 0 },
                5,
                {
                    active: {},
                },
                [
                    [{ x: {} }, { x: {} }, null],
                    [{ o: {} }, { o: {} }, null],
                    [null, null, null],
                ]
            );
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("TileAlreadySet");
            expect(err.error.errorCode.number).to.equal(6001);
        }

        await play(
            gamePubkey,
            playerOne,
            { row: 0, column: 2 },
            5,
            {
                won: {
                    winner: playerOne.publicKey,
                },
            },
            [
                [{ x: {} }, { x: {} }, { x: {} }],
                [{ o: {} }, { o: {} }, null],
                [null, null, null],
            ]
        );

        try {
            await play(
                gamePubkey,
                playerOne,
                { row: 0, column: 2 },
                5,
                {
                    won: {
                        winner: playerOne.publicKey,
                    },
                },
                [
                    [{ x: {} }, { x: {} }, { x: {} }],
                    [{ o: {} }, { o: {} }, null],
                    [null, null, null],
                ]
            );
            chai.assert(false, "Should've failed but din't.");
        } catch (_err) {
            expect(_err).to.be.instanceOf(AnchorError);
            const err: AnchorError = _err;
            expect(err.error.errorCode.code).to.equal("GameAlreayOver");
            expect(err.error.errorCode.number).to.equal(6002);
        }
    });

    it("tie", async () => {
        const { gamePubkey, playerOne, playerTwo } = await init();

        await play(
            gamePubkey,
            playerOne,
            { row: 0, column: 0 },
            2,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [null, null, null],
                [null, null, null],
            ]
        );
        await play(
            gamePubkey,
            playerTwo,
            { row: 1, column: 1 },
            3,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [null, { o: {} }, null],
                [null, null, null],
            ]
        );

        await play(
            gamePubkey,
            playerOne,
            { row: 2, column: 0 },
            4,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [null, { o: {} }, null],
                [{ x: {} }, null, null],
            ]
        );
        await play(
            gamePubkey,
            playerTwo,
            { row: 1, column: 0 },
            5,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [{ o: {} }, { o: {} }, null],
                [{ x: {} }, null, null],
            ]
        );

        await play(
            gamePubkey,
            playerOne,
            { row: 1, column: 2 },
            6,
            {
                active: {},
            },
            [
                [{ x: {} }, null, null],
                [{ o: {} }, { o: {} }, { x: {} }],
                [{ x: {} }, null, null],
            ]
        );
        await play(
            gamePubkey,
            playerTwo,
            { row: 0, column: 1 },
            7,
            {
                active: {},
            },
            [
                [{ x: {} }, { o: {} }, null],
                [{ o: {} }, { o: {} }, { x: {} }],
                [{ x: {} }, null, null],
            ]
        );

        await play(
            gamePubkey,
            playerOne,
            { row: 2, column: 1 },
            8,
            {
                active: {},
            },
            [
                [{ x: {} }, { o: {} }, null],
                [{ o: {} }, { o: {} }, { x: {} }],
                [{ x: {} }, { x: {} }, null],
            ]
        );
        await play(
            gamePubkey,
            playerTwo,
            { row: 2, column: 2 },
            9,
            {
                active: {},
            },
            [
                [{ x: {} }, { o: {} }, null],
                [{ o: {} }, { o: {} }, { x: {} }],
                [{ x: {} }, { x: {} }, { o: {} }],
            ]
        );

        await play(
            gamePubkey,
            playerOne,
            { row: 0, column: 2 },
            9,
            {
                tie: {},
            },
            [
                [{ x: {} }, { o: {} }, { x: {} }],
                [{ o: {} }, { o: {} }, { x: {} }],
                [{ x: {} }, { x: {} }, { o: {} }],
            ]
        );
    });
});
