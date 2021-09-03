import type { NextApiRequest, NextApiResponse } from 'next';
import { Keypair } from '@solana/web3.js';

type T_RES = {
    secret: string;
    address: string;
};

const KeyPair = async (_req: NextApiRequest, res: NextApiResponse<string | T_RES>) => {
    try {
        const keypair = Keypair.generate();
        const address = keypair?.publicKey.toString();
        const secret = JSON.stringify(Array.from(keypair?.secretKey));
        res.status(200).json({
            address,
            secret,
        });
    } catch (err) {
        console.log('Catch keypair: ', err);
        res.status(500).json('Get balance failed');
    }
};

export default KeyPair;
