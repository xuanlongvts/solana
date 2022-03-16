import { useEffect, useState } from "react";
import {
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
    NATIVE_MINT,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createSyncNativeInstruction,
    getAccount,
    Account,
    closeAccount,
} from "@solana/spl-token";

import { connLocal } from "_consts";
import LinkNavs from "_consts/link_nav";
import { HeaderElement } from "_comps";

const WrapUnWrapSolInAToken = () => {
    const [isNative, setIsNative] = useState<boolean | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [beforeAccountBalance, setBeforeAccountBalance] = useState<number>();
    const [afterAccountBalance, setAfterAccountBalance] = useState<number>();

    useEffect(() => {
        (async () => {
            const wallet = Keypair.generate();
            const airdropSignature = await connLocal.requestAirdrop(
                wallet.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(airdropSignature);
            const associatedTokenAccount = await getAssociatedTokenAddress(
                NATIVE_MINT,
                wallet.publicKey
            );
            // Create Token account to hold your wrapped SOL
            const linkTokenAccount = createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedTokenAccount,
                wallet.publicKey,
                NATIVE_MINT
            );
            const ataTransaction = new Transaction().add(linkTokenAccount);

            await sendAndConfirmTransaction(connLocal, ataTransaction, [
                wallet,
            ]);

            // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
            const solTransferTransaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: associatedTokenAccount,
                    lamports: LAMPORTS_PER_SOL,
                }),
                createSyncNativeInstruction(associatedTokenAccount)
            );
            await sendAndConfirmTransaction(connLocal, solTransferTransaction, [
                wallet,
            ]);

            const getAccountInfo: Account = await getAccount(
                connLocal,
                associatedTokenAccount
            );
            setIsNative(getAccountInfo.isNative);
            setAmount(Number(getAccountInfo.amount) / LAMPORTS_PER_SOL);
            console.log(
                `Native: ${getAccountInfo.isNative}, Lamports: ${getAccountInfo.amount}`
            );

            // ========= To unwrap the Token back to SOL:
            const walletBalance = await connLocal.getBalance(wallet.publicKey);
            console.log(`Balance before unwrapping 1 WSOL: ${walletBalance}`);
            setBeforeAccountBalance(walletBalance);

            await closeAccount(
                connLocal,
                wallet,
                associatedTokenAccount,
                wallet.publicKey,
                wallet
            );

            const walletBalancePostClose = await connLocal.getBalance(
                wallet.publicKey
            );
            console.log(
                `Balance after unwrapping 1 WSOL: ${walletBalancePostClose}`
            );
            setAfterAccountBalance(walletBalancePostClose);
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._4.title)}
            <p>
                <strong>Native: </strong>
                <span>{isNative && isNative.toString()}</span>
            </p>
            <p>
                <strong>Amount: </strong>
                <span>{amount}</span>
            </p>
            <p>
                <strong>Before Account Balance: </strong>
                <span>{beforeAccountBalance}</span>
            </p>
            <p>
                <strong>After Account Balance: </strong>
                <span>{afterAccountBalance}</span>
            </p>

            <div className="cli_command">
                <strong>CLI: </strong>
                <p>
                    <span>- Wrapping SOL in a Token: </span>
                    <code>spl-token wrap 1</code>
                </p>
                <p>
                    <span>- UnWrapping SOL in a Token: </span>
                    <code>spl-token unwrap `Token`</code>
                </p>
            </div>
        </section>
    );
};

export default WrapUnWrapSolInAToken;
