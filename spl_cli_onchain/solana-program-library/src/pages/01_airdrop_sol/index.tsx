import { useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { conn } from "_consts";
import LinkNavs from "_consts/link_nav";

import { HeaderElement } from "_comps";

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
            {HeaderElement(LinkNavs._1.title)}
            <p>
                <strong>airdropSignature: </strong>
                <span>{airdropSignature}</span>
            </p>
            <p>
                <strong>balance: </strong>
                <span>{balance}</span>
            </p>
            <div className="cli_command">
                <strong>CLI: </strong>
                <code>solana airdrop 2</code>
            </div>
        </section>
    );
};

export default Airdrop;
