import type { NextApiRequest, NextApiResponse } from 'next';
import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    TransactionInstruction,
} from '@solana/web3.js';

import ENV, { ENUM_envName, getConfig } from '_config';

const CallGreeting = async (req: NextApiRequest, res: NextApiResponse<string | number>) => {
    try {
        const { greeterCode, secret, programId } = req.body;

        console.log('hash: ', req.body);
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');

        const greeterPublicKey = new PublicKey(greeterCode);
        const programKey = new PublicKey(programId);

        const payerSecretKey = new Uint8Array(JSON.parse(secret));
        const payerKeypair = Keypair.fromSecretKey(payerSecretKey);

        const instruction = new TransactionInstruction({
            keys: [{ pubkey: greeterPublicKey, isSigner: false, isWritable: true }],
            programId: programKey,
            data: Buffer.alloc(0), // All instructions are hellos
        });

        const hash = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [payerKeypair]);

        res.status(200).json(hash);
    } catch (err) {
        console.log('Catch api call greeting', err);
        res.status(500).json('Get balance failed');
    }
};

export default CallGreeting;
