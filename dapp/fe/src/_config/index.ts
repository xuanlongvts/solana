const env = process.env.ENV;

export enum ENUM_envName {
    dev = 'dev',
    test = 'test',
    production = 'production',
}

export enum SOLANA_PROTOCOLS {
    RPC = 'HUB_RPC',
    WS = 'HUB_WS',
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
        API_SERVER: 'https://api.devnet.solana.com',
        HUB_RPC: 'https://solana--devnet--rpc.datahub.figment.io/apikey',
        HUB_WS: 'wss://solana--devnet--ws.datahub.figment.io',
        HUB_API_KEY: '',
    },
    [envName.test]: {
        API_SERVER: 'https://api.testnet.solana.com',
        HUB_RPC: '',
        HUB_WS: '',
        HUB_API_KEY: '',
    },
    [envName.production]: {
        API_SERVER: 'https://api.mainnet-beta.solana.com',
        HUB_RPC: 'https://solana--devnet--rpc.datahub.figment.io/apikey',
        HUB_WS: 'wss://solana--devnet--ws.datahub.figment.io',
        HUB_API_KEY: '',
    },
};

export default env;
