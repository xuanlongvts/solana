import { Connection, clusterApiUrl } from "@solana/web3.js";

export const conn: Connection = new Connection(
    clusterApiUrl("devnet"), // testnet
    "confirmed"
);

export const connLocal: Connection = new Connection(
    "http://127.0.0.1:8899",
    "confirmed"
);

export type T_NAV = {
    [key: string]: {
        link: string;
        title: string;
    };
};
