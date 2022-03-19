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
    try {
        console.log("===> Sending Alice's transaction...");
        const aliceTx: TransactionSignature = await connection.sendTransaction(
            tx,
            [aliceKeypair, tempXTokenAccountKeypair, escrowKeypair],
            { skipPreflight: false, preflightCommitment: "confirmed" }
        );
        console.log("aliceTx: ", aliceTx);
    } catch (err) {
        console.log("Err ===> aliceTx: ", err);
    }

    // NOTE: IMPORTANT, sleep to allow time to update
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const escrowAccount = await connection.getAccountInfo(
        escrowKeypair.publicKey
    );
    if (!escrowAccount || !escrowAccount.data.length) {
        console.log("Escrow state account has not been initialized properly");
        process.exit(1);
    }

    const encodedEscrowState = escrowAccount.data;
    const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
        encodedEscrowState
    ) as EscrowLayout;
    if (!decodedEscrowState.isInitialized) {
        console.log("Escrow state initialization flag has not set been set");
        process.exit(1);
    } else if (
        !new PublicKey(decodedEscrowState.initializerPubkey).equals(
            aliceKeypair.publicKey
        )
    ) {
        console.log(
            "InitializerPubkey has not been set correctly / not been set to Alice's public key"
        );
        process.exit(1);
    } else if (
        !new PublicKey(
            decodedEscrowState.initializerTempTokenAccountPubkey
        ).equals(tempXTokenAccountKeypair.publicKey)
    ) {
        console.log(
            "initializerTempTokenAccountPubkey has not been set correctly / not been set to temp X token account public key"
        );
        process.exit(1);
    }

    console.log(
        `Escrow success initialized. Alice offering ${terms.bobExpectedAmount}X for ${terms.aliceExpectedAmount}Y \n`
    );
    writePublicKey(escrowKeypair.publicKey, "escrow");

    console.table([
        {
            "Alice Token Account X": await getTokenBalance(
                aliceXTokenAccountPubkey,
                connection
            ),
            "Alice Token Account Y": await getTokenBalance(
                aliceYTokenAccountPubkey,
                connection
            ),
            "Bob Token Account X": await getTokenBalance(
                getPublickey("bob_x"),
                connection
            ),
            "Bob Token Account Y": await getTokenBalance(
                getPublickey("bob_y"),
                connection
            ),
            "Temporary Token Account X": await getTokenBalance(
                tempXTokenAccountKeypair.publicKey,
                connection
            ),
        },
    ]);
    console.log("");
};

alice();
