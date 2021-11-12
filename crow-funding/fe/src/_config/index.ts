const env = process.env.REACT_APP_ENV;

export enum ENUM_envName {
    dev = 'dev',
    test = 'test',
    production = 'production',
}

export enum SOLANA_PROTOCOLS {
    API_SERVER = 'API_SERVER',
    HUB_RPC = 'HUB_RPC',
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
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
    },
    [envName.test]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.testnet.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
    },
    [envName.production]: {
        [SOLANA_PROTOCOLS.API_SERVER]: 'https://api.mainnet-beta.solana.com',
        [SOLANA_PROTOCOLS.HUB_RPC]: '',
    },
};

export const getConfig = (envParams = env, protocol = SOLANA_PROTOCOLS.API_SERVER) => {
    return Config[envParams as string][protocol];
};

export default env;
