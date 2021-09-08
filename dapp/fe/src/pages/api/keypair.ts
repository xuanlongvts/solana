import type { NextApiRequest, NextApiResponse } from 'next';
import { Keypair } from '@solana/web3.js';

type T_RES = {
    secret: string;
    address: string;
};

const KeyPair = async (_req: NextApiRequest, res: NextApiResponse<string | T_RES>) => {
    try {
        /* ---------------- For hardcode from local ~/.config/solana/id.json */
        // const keypairLocal = [
        //     161, 5, 105, 6, 45, 236, 206, 155, 144, 48, 29, 33, 118, 187, 84, 105, 187, 38, 231, 51, 36, 239, 170, 99,
        //     20, 203, 179, 15, 26, 122, 71, 171, 98, 70, 29, 229, 6, 182, 141, 93, 97, 46, 204, 177, 58, 236, 219, 10,
        //     208, 221, 200, 153, 212, 117, 74, 225, 48, 3, 129, 88, 79, 245, 123, 43,
        // ];
        // const payerSecretKey = new Uint8Array(keypairLocal);
        // const payerKeypair = Keypair.fromSecretKey(payerSecretKey);
        // const address = '7ccy2ffVkTfKK781jShQxwAAL7xYexZruDhH7xwgiRsY';
        // const secret = JSON.stringify(Array.from(payerKeypair.secretKey));

        /* ---------------- For real API genegrate */
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
