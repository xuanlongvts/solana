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

const Greeter = async (req: NextApiRequest, res: NextApiResponse<string | number>) => {
    try {
        const { greeterCode } = req.body;
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');
        const greeterPublicKey = new PublicKey(greeterCode);

        const accountInfo = await connection.getAccountInfo(greeterPublicKey);
        if (accountInfo === null) {
            throw new Error('Error: cannot find the greeted account');
        }

        const greeting = borsh.deserialize(GreetingSchema, GreetingAccount, accountInfo.data);

        res.status(200).json(greeting.counter);
    } catch (err) {
        console.log('Catch api get greeting counters', err);
        res.status(500).json('Get Greeting failed');
    }
};

export default Greeter;
