import { Connection, clusterApiUrl } from "@solana/web3.js";

export const conn: Connection = new Connection(
    clusterApiUrl("devnet"),
    "confirmed"
);
