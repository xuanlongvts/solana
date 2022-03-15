import { useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    createMint,
    getMint,
    getOrCreateAssociatedTokenAccount,
    getAccount,
    mintTo,
} from "@solana/spl-token";

import { conn } from "_consts";
import LinkNavs from "_consts/link_nav";

import { HeaderElement } from "_comps";

const CreateFungibleToken = () => {
    let [mint, setMint] = useState<string>("");
    let [mintInfo1, setMintInfo1] = useState<number>();
    let [mintInfo2, setMintInfo2] = useState<number>();
    let [tokenAccountAddress, setTokenAccountAddress] = useState<string>();
    let [tokenAccountInfoAmount1, setTokenAccountInfoAmount1] =
        useState<number>();
    let [tokenAccountInfoAmount2, setTokenAccountInfoAmount2] =
        useState<number>();

    const payer = Keypair.generate();
    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();

    useEffect(() => {
        (async (): Promise<void> => {
            // 1. airdrop for account payer
            const airdropSignature = await conn.requestAirdrop(
                payer.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await conn.confirmTransaction(airdropSignature);

            // 2. mint a token
            const mint = await createMint(
                conn,
                payer,
                mintAuthority.publicKey,
                freezeAuthority.publicKey,
                9 // We are using 9 to match the CLI decimal default exactly
            );
            console.log("mint: ===> ", mint.toBase58());
            setMint(mint.toBase58());

            // 3. get information about a mint
            const mintInfo = await getMint(conn, mint);
            console.log("mintInfo 1: ===> ", mintInfo.supply);
            setMintInfo1(Number(mintInfo.supply));

            // 4. retrieve the associated token account
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                conn,
                payer,
                mint,
                payer.publicKey
            );
            console.log("tokenAccount: ===> ", tokenAccount.address.toBase58());
            setTokenAccountAddress(tokenAccount.address.toBase58());

            const tokenAccountInfo = await getAccount(
                conn,
                tokenAccount.address
            );
            console.log("tokenAccountInfo 1: ===> ", tokenAccountInfo.amount);
            setTokenAccountInfoAmount1(Number(tokenAccountInfo.amount));

            // 5. Mint 100 tokens into the account:
            await mintTo(
                conn,
                payer,
                mint,
                tokenAccount.address,
                mintAuthority,
                100
            );

            const mintInfoAfter = await getMint(conn, mint);
            console.log("mintInfo 2: ===> ", mintInfoAfter.supply);
            setMintInfo2(Number(mintInfoAfter.supply));

            const tokenAccountInfoAfter = await getAccount(
                conn,
                tokenAccount.address
            );
            console.log(
                "tokenAccountInfo 2: ===> ",
                tokenAccountInfoAfter.amount
            );
            setTokenAccountInfoAmount2(Number(tokenAccountInfoAfter.amount));
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._2.title)}
            <p>
                <strong>mint: </strong>
                <span>{mint}</span>
            </p>
            <p>
                <strong>mintInfo1: </strong>
                <span>{mintInfo1}</span>
            </p>
            <p>
                <strong>mintInfo2: </strong>
                <span>{mintInfo2}</span>
            </p>
            <p>
                <strong>tokenAccountAddress: </strong>
                <span>{tokenAccountAddress}</span>
            </p>
            <p>
                <strong>tokenAccountInfoAmount1: </strong>
                <span>{tokenAccountInfoAmount1}</span>
            </p>
            <p>
                <strong>tokenAccountInfoAmount2: </strong>
                <span>{tokenAccountInfoAmount2}</span>
            </p>
            <div className="cli_command">
                <strong>CLI: </strong>
                <p>
                    <span>- Create token: </span>
                    <code>spl-token create-token</code>
                </p>
                <p>
                    <span>- Get information token: </span>
                    <code>spl-token supply {mint}</code>
                </p>
                <p>
                    <span>
                        - Create an account to hold a balance of the new: {mint}
                    </span>
                    <code>spl-token create-account {tokenAccountAddress}</code>
                </p>
                <p>
                    <span>- Get balance of token: {mint}</span>
                    <code>spl-token balance {mint}</code>
                </p>
                <p>
                    <span>- Mint 100 tokens into the account: {mint}</span>
                    <code>spl-token mint {mint} 100</code>
                </p>
                <p>
                    <span>
                        - The token supply and account balance now reflect the
                        result of minting:
                    </span>
                    <br />
                    <br />
                    <code>spl-token supply {mint}</code> <br />
                    <br />
                    <code>spl-token balance {mint}</code>
                </p>
            </div>
        </section>
    );
};

export default CreateFungibleToken;
