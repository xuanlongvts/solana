import { Connection, PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';

import ENV, { ENUM_envName, getConfig } from '_config';

const Balance = async (req: NextApiRequest, res: NextApiResponse<string | number>) => {
    try {
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');
        const { address_account } = req.body;
        const publickey = new PublicKey(address_account as PublicKey);
        const balance = await connection.getBalance(publickey);
        console.log('balance: ', balance);
        res.status(200).json(balance);
    } catch (err) {
        console.log('Catch Balance api: ', err);
        res.status(500).json('Get balance failed');
    }
};

export default Balance;
