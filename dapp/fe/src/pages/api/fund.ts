import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

import ENV, { ENUM_envName, getConfig } from '_config';

const fund = async (req: NextApiRequest, res: NextApiResponse<string>) => {
    try {
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');
        const { address_account, number_lamports } = req.body;
        const pubKey = new PublicKey(address_account as PublicKey);
        const hash = await connection.requestAirdrop(pubKey, number_lamports);
        await connection.confirmTransaction(hash);
        res.status(200).json(hash);
    } catch (err) {
        console.log('Catch api fund: ', err);
        res.status(500).json('airdrop failed');
    }
};

export default fund;
