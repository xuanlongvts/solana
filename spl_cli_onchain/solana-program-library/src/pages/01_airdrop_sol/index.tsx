import { useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { conn } from "_consts";

const Airdrop = () => {
    let [airdropSignature, setAirdropSignature] = useState<string>("");
    let [balance, setBalance] = useState<number>(0);

    const payer = Keypair.generate();

    useEffect(() => {
        (async (): Promise<void> => {
            const airdropSignature = await conn.requestAirdrop(
                payer.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await conn.confirmTransaction(airdropSignature);
            setAirdropSignature(airdropSignature);
            console.log("airdropSignature: ", airdropSignature);

            const getAmounts = await conn.getBalance(payer.publicKey);
            console.log("getAmounts: ", getAmounts);
            setBalance(getAmounts);
        })();
    }, []);

    return (
        <section>
            <h2>Airdrop</h2>
            <p>
                <strong>airdropSignature: </strong>
                <span>{airdropSignature}</span>
            </p>
            <p>
                <strong>balance: </strong>
                <span>{balance}</span>
            </p>
        </section>
    );
};

export default Airdrop;
