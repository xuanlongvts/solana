import { Connection, Keypair } from "@solana/web3.js";
import fs from "mz/fs";
import path from "path";
import os from "os";
import yaml from "yaml";

let payer: Keypair;

export const NAME_FOLDER = "accounts";

export const connection = new Connection("http://127.0.0.1:8899", "confirmed");

export const ACC_PATH = (name: string) =>
    path.resolve(__dirname, `../${NAME_FOLDER}/${name}.json`);

export const getPayer = async (): Promise<Keypair> => {
    try {
        const config = await getConfig();
        if (!config.keypair_path) {
            throw new Error("Missing keypair path");
        }
        return await createKeypairFromFile(config.keypair_path);
    } catch (err) {
        console.warn(
            "Failed to create keypair from CLI config file, falling back to new random keypair"
        );
        return Keypair.generate();
    }
};

// Create a Keypair from a secret key stored in file as byte's array
export const createKeypairFromFile = async (
    filePath: string
): Promise<Keypair> => {
    const secretKeyString = await fs.readFile(filePath, {
        encoding: "utf8",
    });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
};

export const getConfig = async (): Promise<any> => {
    const CONFIG_FILE_PATH = path.resolve(
        os.homedir(),
        ".config",
        "solana",
        "cli",
        "config.yml"
    );
    const configYml = await fs.readFile(CONFIG_FILE_PATH, {
        encoding: "utf8",
    });
    return yaml.parse(configYml);
};

export const getRpcUrl = async (): Promise<string> => {
    try {
        const config = await getConfig();
        if (!config.json_rpc_url) {
            throw new Error("Missing RPC URL");
        }
        return config.json_rpc_url;
    } catch (err) {
        console.warn(
            "Failed to read RPC url from CLI config file, falling back to localhost"
        );
        return "http://127.0.0.1:8899";
    }
};

// Establish a connection to the cluster
export const establishConnection = async (): Promise<void> => {
    const rpcUrl = await getRpcUrl();
    const connection = new Connection(rpcUrl, "confirmed");
    const version = await connection.getVersion();
    console.log("Connection to cluster established:", rpcUrl, version);
};
