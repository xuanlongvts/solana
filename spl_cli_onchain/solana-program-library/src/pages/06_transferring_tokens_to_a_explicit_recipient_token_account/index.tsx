import { useEffect, useState } from "react";
import {
    getAccount,
    createMint,
    createAccount,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    transfer,
} from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { connLocal } from "_consts";
import LinkNavs from "_consts/link_nav";
import { HeaderElement } from "_comps";

const TransferingTokenExplicit = () => {
    const [amountAccountInfo1, setAmountAccountInfo1] = useState<number>();
    const [amountAccountInfo2, setAmountAccountInfo2] = useState<number>();
    const [amountAccountInfoReceive, setAmountAccountInfoReceive] =
        useState<number>();

    useEffect(() => {
        (async () => {
            const wallet = Keypair.generate();
            const auxiliryKeypair = Keypair.generate();
            const airdropSignature = await connLocal.requestAirdrop(
                wallet.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(airdropSignature);

            // mint a token
            const mint = await createMint(
                connLocal,
                wallet,
                wallet.publicKey,
                wallet.publicKey,
                9
            );

            // create custom token account
            const auxiliryTokenAccount = await createAccount(
                connLocal,
                wallet,
                mint,
                wallet.publicKey,
                auxiliryKeypair
            );

            const associatedTokenAccount =
                await getOrCreateAssociatedTokenAccount(
                    connLocal,
                    wallet,
                    mint,
                    wallet.publicKey
                );

            await mintTo(
                connLocal,
                wallet,
                mint,
                associatedTokenAccount.address,
                wallet,
                50
            );
            let accountInfo = await getAccount(
                connLocal,
                associatedTokenAccount.address
            );
            setAmountAccountInfo1(Number(accountInfo.amount));
            console.log(
                "Amount of accountInfo before transfer : ===> ",
                accountInfo.amount
            );

            await transfer(
                connLocal,
                wallet,
                associatedTokenAccount.address,
                auxiliryTokenAccount,
                wallet,
                50
            );

            const auxAccountInfo = await getAccount(
                connLocal,
                auxiliryTokenAccount
            );
            setAmountAccountInfoReceive(Number(auxAccountInfo.amount));
            console.log("auxAccountInfo amount: ===> ", auxAccountInfo.amount);

            accountInfo = await getAccount(
                connLocal,
                associatedTokenAccount.address
            );
            setAmountAccountInfo2(Number(accountInfo.amount));
            console.log(
                "Amount of accountInfo after transfer : ===> ",
                accountInfo.amount
            );
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._6.title)}
            <p>
                <strong>Amount Account Info before mint token: </strong>
                <span>{amountAccountInfo1}</span>
            </p>
            <p>
                <strong>Amount Account After before mint token: </strong>
                <span>{amountAccountInfo2}</span>
            </p>
            <p>
                <strong>Amount Account receive token: </strong>
                <span>{amountAccountInfoReceive}</span>
            </p>

            <div className="cli_command">
                <strong>CLI: </strong>
                <p>
                    <span>
                        - 0. First, list all token onwer by default account
                    </span>
                    <code>spl-token accounts</code>
                </p>
                <p>
                    <span>
                        - 1. Create a new account: cd `Dowload/wallet` folder,
                        run{" "}
                    </span>
                    <code>solana-keygen new -o auxiliary_keypair.json</code>
                </p>
                <p>
                    <span>- 2. Create a new account link with token:</span>
                    <code>
                        solana-keygen create-account `Token` 50
                        auxiliary_keypair.json
                    </code>
                </p>
                <p>
                    <span>- 3. List all account with token:</span>
                    <code>spl-token accounts `Token` -v</code>
                </p>
                <p>
                    <span>- 4. Transfer token to new account link with:</span>
                    <code>spl-token transfer `Token` 50 `Token`</code>
                </p>
                <p>
                    <span>- 5. List all account with token:</span>
                    <code>spl-token accounts `Token` -v</code>
                </p>
                <p>
                    <span>- NOTE:</span>
                    <code>Account send will decrease</code>{" "}
                    <code>Account receive will increase</code>
                </p>
            </div>
        </section>
    );
};

export default TransferingTokenExplicit;
