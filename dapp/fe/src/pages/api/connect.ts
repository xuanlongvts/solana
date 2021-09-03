import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection } from '@solana/web3.js';

import ENV, { ENUM_envName, getConfig } from '_config';

const ConnectCluster = async (_req: NextApiRequest, res: NextApiResponse<string>) => {
    try {
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');
        const version = await connection.getVersion();
        res.status(200).json(version?.['solana-core']);
    } catch (err) {
        console.log('Catch Connect Cluster: ', err);
        res.status(500).json(err);
    }
};

export default ConnectCluster;
