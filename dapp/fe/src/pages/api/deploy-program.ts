import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import path from 'path';
import fs from 'mz/fs';

import ENV, { ENUM_envName, getConfig } from '_config';

const PROGRAM_PATH = path.resolve('../program/dist');
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'dapp.so');

const deployProgram = async (req: NextApiRequest, res: NextApiResponse<string | boolean>) => {
    try {
        const { programId } = req.body;
        const getUrl = getConfig(ENV ?? ENUM_envName.dev);
        const connection = new Connection(getUrl, 'confirmed');
        const pubKey = new PublicKey(programId as PublicKey);
        const programInfo = await connection.getAccountInfo(pubKey);

        if (programInfo === null) {
            if (fs.existsSync(PROGRAM_SO_PATH)) {
                throw new Error('Program needs to be deployed with `solana program deploy`');
            } else {
                throw new Error('Program needs to be built and deployed');
            }
        } else if (!programInfo.executable) {
            throw new Error(`Program is not executable`);
        }

        res.status(200).json(true);
    } catch (err) {
        console.log('Catch api deployProgram', err);
        res.status(500).json(err);
    }
};

export default deployProgram;

/*
https://learn.figment.io/tutorials/deploy-solana-program

solana-keygen pubkey ../program/dist/dapp-keypair.json
solana balance pubkey
example: pubkey in ../program/dist/ folder: 212HwEXp9AsECJG4yzixi7sUWLkDy8LLxcD2z5WDKMcW

1. airdrop SOL for local account
    solana-keygen pubkey ~/.config/solana/id.json
	solana airdrop 10 pubkey

2. solana deploy -v --keypair local keypair/keypair.json ../program/dist/dapp.so
	example: solana deploy -v --keypair ~/.config/solana/id.json dapp.so

	RPC URL: https://api.devnet.solana.com
	Default Signer Path: /Users/lelong/.config/solana/id.json
	Commitment: confirmed
	Program Id: 7db9hme4nJMw79NBVRwjwStUnZEkyuAUW2fhteScRFQM

3. Copy and Paste Program Id to step 6 for check status program deploy and work


===========
example: Can also deploy multi times will generage different programId, we use different programId for check
solana deploy -v --keypair /Users/lelong/Downloads/solana/wallet/keypair.json dapp.so
*/
