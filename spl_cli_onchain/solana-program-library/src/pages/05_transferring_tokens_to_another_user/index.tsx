import { useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
} from "@solana/spl-token";

import { connLocal } from "_consts";
import LinkNavs from "_consts/link_nav";
import { HeaderElement } from "_comps";

const TransferTokens = () => {
    const [signatureAfterTransfer, setSignatureAfterTransfer] =
        useState<string>("");

    const [
        signatureAfterTransferWithSenderFunding,
        setSignatureAfterTransferWithSenderFunding,
    ] = useState<string>("");

    useEffect(() => {
        (async () => {
            const fromWallet = Keypair.generate();
            const fromAirdropSignature = await connLocal.requestAirdrop(
                fromWallet.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(fromAirdropSignature);

            const toWallet = Keypair.generate();
            // Create mint token
            const mint = await createMint(
                connLocal,
                fromWallet,
                fromWallet.publicKey,
                null,
                9
            );

            // Get the token account of the fromWallet address, and if does not exist, create it
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connLocal,
                fromWallet,
                mint,
                fromWallet.publicKey
            );

            // Get the token account of the tokenWallet address, and if does not exist, create it
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connLocal,
                fromWallet,
                mint,
                toWallet.publicKey
            );

            // Mint 1 new token to the "fromTokenAccount" account we just created
            let signature = await mintTo(
                connLocal,
                fromWallet,
                mint,
                fromTokenAccount.address,
                fromWallet.publicKey,
                LAMPORTS_PER_SOL
            );

            // Transfer the new token to the "toTokenAccount" we just created
            signature = await transfer(
                connLocal,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                50
            );
            setSignatureAfterTransfer(signature);
            console.log("signature: ===> ", signature);

            // Transferring tokens to another user, with sender-funding
            signature = await transfer(
                connLocal,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                50,
                [fromWallet, toWallet]
            );
            setSignatureAfterTransferWithSenderFunding(signature);
            console.log("signature: with sender funding: ===> ", signature);
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._5.title)}
            <p>
                <strong>Signature after transfer: </strong>
                <span>{signatureAfterTransfer}</span>
            </p>
            <p>
                <strong>Signature after transfer with funder-funding: </strong>
                <span>{signatureAfterTransferWithSenderFunding}</span>
            </p>
            <div className="cli_command">
                <strong>CLI: </strong>
                <p>
                    <span>- Transferring tokens to another user:</span>
                    <code>spl-token transfer `Token` 50 `Token`</code>
                </p>
                <p>
                    <span>
                        - Transferring tokens to another user, with
                        sender-funding{" "}
                    </span>
                    <code>
                        spl-token transfer --fund-recipient `Token` 50 `Token`
                    </code>
                </p>
            </div>
        </section>
    );
};

export default TransferTokens;
