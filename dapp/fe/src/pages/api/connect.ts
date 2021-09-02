import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection } from '@solana/web3.js';

import ENV, { ENUM_envName, SOLANA_PROTOCOLS, Config } from '_config';

const ConnectCluster = async (_req: NextApiRequest, res: NextApiResponse<string>) => {
    try {
        const getUrl = Config[ENV ?? ENUM_envName.dev][SOLANA_PROTOCOLS.RPC];
        const connection = new Connection(getUrl, 'confirmed');
        const version = await connection.getVersion();
        res.status(200).json(version?.['solana-core']);
    } catch (err) {
        console.log('Catch ConnectCluster: ', err);
        res.status(500).json(err);
    }
};

export default ConnectCluster;
