import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

import ENV, { ENUM_envName, getConfig } from '_config';

type T_REQ = {
    address: string;
    secret: string;
    recipient: string;
    lamports: number;
};
const Transfer = async (req: NextApiRequest, res: NextApiResponse<string>) => {
    try {
        const { address, secret, recipient, lamports } = req.body as T_REQ;
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');

        const fromPubkey = new PublicKey(address as string);
        const toPubkey = new PublicKey(recipient as string);

        const secretKey = Uint8Array.from(JSON.parse(secret as string));

        const instructions = SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports,
        });

        const signers = [
            {
                publicKey: fromPubkey,
                secretKey,
            },
        ];

        const transaction = new Transaction().add(instructions);
        const hash = await sendAndConfirmTransaction(connection, transaction, signers);

        res.status(200).json(hash);
    } catch (err) {
        console.log('Catch api: ', err);
        res.status(500).json('Transfer failed');
    }
};

export default Transfer;
