import {
    AccountLayout,
    TOKEN_PROGRAM_ID,
    createInitializeAccountInstruction,
    createTransferCheckedInstruction,
    createTransferInstruction,
} from "@solana/spl-token";

import {
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
    TransactionSignature,
} from "@solana/web3.js";
const BN = require("bn.js");

import {
    EscrowLayout,
    ESCROW_ACCOUNT_DATA_LAYOUT,
    writePublicKey,
    getPublickey,
    getPrivateKey,
    getKeypair,
    getProgramId,
    getTerms,
    getTokenBalance,
} from "./utils";
import { connection } from "./const";

const alice = async () => {
    const escrowProgramId = getProgramId();
    const terms = getTerms();

    const aliceXTokenAccountPubkey = getPublickey("alice_x");
    const aliceYTokenAccountPubkey = getPublickey("alice_y");
    const X_TokenMintPubkey = getPublickey("mint_x");
    const aliceKeypair = getKeypair("alice");

    const tempXTokenAccountKeypair = new Keypair();

    const createTempTokenAccountIx: TransactionInstruction =
        SystemProgram.createAccount({
            fromPubkey: aliceKeypair.publicKey,
            newAccountPubkey: tempXTokenAccountKeypair.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(
                AccountLayout.span
            ),
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
        });

    const initTempAccountIx: TransactionInstruction =
        createInitializeAccountInstruction(
            tempXTokenAccountKeypair.publicKey,
            X_TokenMintPubkey,
            aliceKeypair.publicKey,
            TOKEN_PROGRAM_ID
        );
    const transferXTokensToTempAccIx: TransactionInstruction =
        createTransferInstruction(
            aliceXTokenAccountPubkey,
            tempXTokenAccountKeypair.publicKey,
            aliceKeypair.publicKey,
            terms.bobExpectedAmount,
            [],
            TOKEN_PROGRAM_ID
        );

    const escrowKeypair = new Keypair();
    const createEscrowAccountIx = SystemProgram.createAccount({
        fromPubkey: aliceKeypair.publicKey,
        newAccountPubkey: escrowKeypair.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
            ESCROW_ACCOUNT_DATA_LAYOUT.span
        ),
        space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
        programId: escrowProgramId,
    });
    const initEscrowIx = new TransactionInstruction({
        keys: [
            {
                pubkey: aliceKeypair.publicKey,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: tempXTokenAccountKeypair.publicKey,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: aliceYTokenAccountPubkey,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: escrowKeypair.publicKey,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
        ],
        programId: escrowProgramId,
        data: Buffer.from(
            Uint8Array.of(
                0,
                ...new BN(terms.aliceExpectedAmount).toArray("le", 8)
            )
        ),
    });

    const tx: Transaction = new Transaction().add(
        createTempTokenAccountIx,
        initTempAccountIx,
        transferXTokensToTempAccIx,
        createEscrowAccountIx,
        initEscrowIx
    );

    console.log("===> Sending Alice's transaction...");
    try {
        const aliceTx: TransactionSignature = await connection.sendTransaction(
            tx,
            [aliceKeypair, tempXTokenAccountKeypair, escrowKeypair],
            { skipPreflight: false, preflightCommitment: "confirmed" }
        );
        console.log("aliceTx: ", aliceTx);
    } catch (err) {
        console.log("err ===> aliceTx: ", err);
    }
};

alice();
