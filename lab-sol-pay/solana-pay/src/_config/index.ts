import { PublicKey } from '@solana/web3.js';

const ENV = require('../../env.json').ENV;

export enum ENUM_envName {
    local = 'local',
    dev = 'dev',
    test = 'test',
    production = 'production',
}

export enum SOLANA_PROTOCOLS {
    API_SERVER = 'API_SERVER',
    HUB_RPC = 'HUB_RPC',
    HUB_WS = 'HUB_WS',
}

type T_envName = {
    local: string;
    dev: string;
    test: string;
    production: string;
};
export const envName: T_envName = {
    [ENUM_envName.local]: 'local',
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.test]: 'qc',
    [ENUM_envName.production]: 'production',
};

export const Config = {
    [envName.local]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'http://127.0.0.1:8000',
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
        [SOLANA_PROTOCOLS.HUB_WS]: '',
    },
    [envName.dev]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.devnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: 'https://solana--devnet--rpc.datahub.figment.io/apikey',
        [SOLANA_PROTOCOLS.HUB_WS]: 'wss://solana--devnet--ws.datahub.figment.io',
    },
    [envName.test]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.testnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
        [SOLANA_PROTOCOLS.HUB_WS]: '',
    },
    [envName.production]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.mainnet-beta.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: 'https://solana--devnet--rpc.datahub.figment.io/apikey',
        [SOLANA_PROTOCOLS.HUB_WS]: 'wss://solana--devnet--ws.datahub.figment.io',
    },
};

export const WalletRecipient = 'BYaqcY4KvRkcjXTK8REEyWvs5FVajjdTRcoADAqVSULT'; // phantom wallet of recipient

export const programAccount = new PublicKey('DcGPfiGbubEKh1EnQ86EdMvitjhrUo8fGSgvqtFG4A9t');

export const adminAddress = new PublicKey('DGqXoguiJnAy8ExJe9NuZpWrnQMCV14SdEdiMEdCfpmB');

export const getConfig = (envParams = ENV, protocol = SOLANA_PROTOCOLS.API_SERVER) => {
    return Config[envParams as string][protocol];
};

export const accountExplorer = (address: string) => {
    let cluster = 'devnet';
    ENV === ENUM_envName.test && (cluster = 'testnet');
    ENV === ENUM_envName.production && (cluster = 'mainnet-beta');
    return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
};

export const transactionExplorer = (signature: string) => {
    let cluster = 'devnet';
    ENV === ENUM_envName.test && (cluster = 'testnet');
    ENV === ENUM_envName.production && (cluster = 'mainnet-beta');
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};

export default ENV;
