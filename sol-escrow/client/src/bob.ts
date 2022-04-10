import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import {
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    AccountInfo,
} from "@solana/web3.js";
const BN = require("bn.js");

// import "bn.js";

import {
    EscrowLayout,
    ESCROW_ACCOUNT_DATA_LAYOUT,
    getPublickey,
    getKeypair,
    getProgramId,
    getTerms,
    getTokenBalance,
    T_terms,
} from "./utils";
import { connection } from "./const";

const Bob = async () => {
    const escrowProgramId: PublicKey = getProgramId();
    const terms: T_terms = getTerms();

    const bobKeypair: Keypair = getKeypair("bob");
    const bobXTokenAccountPubkey: PublicKey = getPublickey("bob_x");
    const bobYTokenAccountPubkey: PublicKey = getPublickey("bob_y");
    const escrowStateAccountPubkey: PublicKey = getPublickey("escrow");

    const escrowAccount: AccountInfo<Buffer> | null =
        await connection.getAccountInfo(escrowStateAccountPubkey);
    if (!escrowAccount) {
        console.log("Could not find escrow at give address!");
        process.exit(1);
    }

    const endcodeEscrowState = escrowAccount.data;
    const decodeEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
        endcodeEscrowState
    ) as EscrowLayout;

    const escrowState = {
        escrowAccountPubkey: escrowStateAccountPubkey,
        isInitialized: !!decodeEscrowLayout.isInitialized,
        initializerAccountPubkey: new PublicKey(
            decodeEscrowLayout.initializerPubkey
        ),
        XTokenTempAccountPubkey: new PublicKey(
            decodeEscrowLayout.initializerTempTokenAccountPubkey
        ),
        initializerYTokenAccount: new PublicKey(
            decodeEscrowLayout.initializerReceivingTokenAccountPubkey
        ),
        expectAmount: new BN(decodeEscrowLayout.expectedAmount, 10, "le"),
    };

    const PDA: [PublicKey, number] = await PublicKey.findProgramAddress(
        [Buffer.from("escrow")],
        escrowProgramId
    );

    const exchangeInstruction = new TransactionInstruction({
        programId: escrowProgramId,
        data: Buffer.from(
            Uint8Array.of(
                1,
                ...new BN(terms.bobExpectedAmount).toArray("le", 8)
            )
        ),
        keys: [
            { pubkey: bobKeypair.publicKey, isSigner: true, isWritable: false }, // Account 1
            {
                // Account 2
                pubkey: bobYTokenAccountPubkey,
                isSigner: false,
                isWritable: true,
            },
            {
                // Account 3
                pubkey: bobXTokenAccountPubkey,
                isSigner: false,
                isWritable: true,
            },
            {
                // Account 4
                pubkey: escrowState.XTokenTempAccountPubkey,
                isSigner: false,
                isWritable: true,
            },
            {
                // Account 5 (Alice's public key)
                pubkey: escrowState.initializerAccountPubkey,
                isSigner: false,
                isWritable: true,
            },
            {
                // Account 6 (Alice's Y Token Account Pubkey)
                pubkey: escrowState.initializerYTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                // Account 7
                pubkey: escrowStateAccountPubkey,
                isSigner: false,
                isWritable: true,
            },
            {
                // Account 8
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            {
                // Account 9
                pubkey: PDA[0],
                isSigner: false,
                isWritable: false,
            },
        ],
    });

    const aliceYTokenAccountPubkey: PublicKey = getPublickey("alice_y");
    const [aliceYBalance, bobXBalance]: [number, number] = await Promise.all([
        getTokenBalance(aliceYTokenAccountPubkey, connection),
        getTokenBalance(bobXTokenAccountPubkey, connection),
    ]);

    console.log("Sending Bob's transaction...");
    await connection.sendTransaction(
        new Transaction().add(exchangeInstruction),
        [bobKeypair],
        {
            skipPreflight: false,
            preflightCommitment: "confirmed",
        }
    );

    // sleep to allow time update to reset escrowStateAccountPubkey account
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if ((await connection.getAccountInfo(escrowStateAccountPubkey)) !== null) {
        console.log("Err: Escrow account has not been closed");
        process.exit(1);
    }

    const newAliceYbalance: number = await getTokenBalance(
        aliceYTokenAccountPubkey,
        connection
    );
    if (newAliceYbalance !== aliceYBalance + terms.aliceExpectedAmount) {
        console.log(
            `Alice's Y balance should be ${
                aliceYBalance + terms.aliceExpectedAmount
            }, but is ${newAliceYbalance}`
        );
        process.exit(1);
    }

    const newBobXBalance: number = await getTokenBalance(
        bobXTokenAccountPubkey,
        connection
    );
    if (newBobXBalance !== bobXBalance + terms.bobExpectedAmount) {
        console.log(
            `Bob X Balance should be ${
                bobXBalance + terms.bobExpectedAmount
            }, but is ${newBobXBalance}`
        );
        process.exit(1);
    }
    console.log(
        "Trade successfully executed. All temporary accounts closed \n"
    );
    console.table([
        {
            "Alice Token account X": await getTokenBalance(
                getPublickey("alice_x"),
                connection
            ),
            "Alice Token account Y": newAliceYbalance,
            "Bob Token Account X": newBobXBalance,
            "Bob Token Account Y": await getTokenBalance(
                bobYTokenAccountPubkey,
                connection
            ),
        },
    ]);
};

/*
    Step 3
    ┌─────────┬───────────────────────┬───────────────────────┬─────────────────────┬─────────────────────┐
    │ (index) │ Alice Token account X │ Alice Token account Y │ Bob Token Account X │ Bob Token Account Y │
    ├─────────┼───────────────────────┼───────────────────────┼─────────────────────┼─────────────────────┤
    │    0    │          45           │           3           │          5          │         47          │
    └─────────┴───────────────────────┴───────────────────────┴─────────────────────┴─────────────────────┘
*/

Bob();
