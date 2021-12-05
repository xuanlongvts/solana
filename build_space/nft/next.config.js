module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        CANDY_MACHINE_CONFIG: process.env.REACT_APP_CANDY_MACHINE_CONFIG,
        CANDY_MACHINE_ID: process.env.REACT_APP_CANDY_MACHINE_ID,
        TREASURY_ADDRESS: process.env.REACT_APP_TREASURY_ADDRESS,
        SOLANA_NETWORK: process.env.REACT_APP_SOLANA_NETWORK,
        SOLANA_RPC_HOST: process.env.REACT_APP_SOLANA_RPC_HOST,
    },
    images: {
        domains: ['www.arweave.net'],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },
};
