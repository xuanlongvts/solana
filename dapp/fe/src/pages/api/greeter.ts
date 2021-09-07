import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';

import ENV, { ENUM_envName, getConfig } from '_config';

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
        const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SEED);

        res.status(200).json('true');
    } catch (err) {
        console.log('Catch api Greeter', err);
        res.status(500).json('Get balance failed');
    }
};

export default Greeter;
