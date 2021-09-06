const ENV = require('../../env.json').ENV;

export enum ENUM_envName {
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
    dev: string;
    test: string;
    production: string;
};
export const envName: T_envName = {
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.test]: 'qc',
    [ENUM_envName.production]: 'production',
};

export const Config = {
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

export const getConfig = (envParams = ENV, protocol = SOLANA_PROTOCOLS.API_SERVER) => {
    return Config[envParams as string][protocol];
};

export const transactionExplorer = (signature: string) => {
    let cluster = 'devnet';
    ENV === ENUM_envName.test && (cluster = 'testnet');
    ENV === ENUM_envName.production && (cluster = 'mainnet-beta');
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};

export default ENV;
