import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import * as borsh from 'borsh';

import ENV, { ENUM_envName, getConfig } from '_config';

class GreetingAccount {
    counter = 0;
    constructor(fields: { counter: number } | undefined = undefined) {
        if (fields) {
            this.counter = fields.counter;
        }
    }
}

const GreetingSchema = new Map([[GreetingAccount, { kind: 'struct', fields: [['counter', 'u32']] }]]);

const GREETING_SIZE = borsh.serialize(GreetingSchema, new GreetingAccount()).length;

type T_RES = {
    hash: string;
    greeter: string;
};
const Greeter = async (req: NextApiRequest, res: NextApiResponse<T_RES | string>) => {
    try {
        const { programId, secret } = req.body;
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');
        const getProgramId = new PublicKey(programId as string);

        const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret as string)));
        const GREETING_SEED = 'hello';

        const greetedPubkey = await PublicKey.createWithSeed(payer.publicKey, GREETING_SEED, getProgramId);
        const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

        const transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: payer.publicKey,
                basePubkey: payer.publicKey,
                seed: GREETING_SEED,
                newAccountPubkey: greetedPubkey,
                lamports,
                space: GREETING_SIZE,
                programId: getProgramId,
            }),
        );
        const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
        res.status(200).json({
            hash,
            greeter: greetedPubkey.toBase58(),
        });
    } catch (err) {
        console.log('Catch api Greeter', err);
        res.status(500).json('Get balance failed');
    }
};

export default Greeter;
