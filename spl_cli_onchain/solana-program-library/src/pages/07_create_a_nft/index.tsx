import { useEffect, useState } from "react";
import {
    getAccount,
    createMint,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    createSetAuthorityInstruction,
    AuthorityType,
    getMint,
} from "@solana/spl-token";
import {
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import { connLocal } from "_consts";
import LinkNavs from "_consts/link_nav";
import { HeaderElement } from "_comps";

const CreateNFT = () => {
    const [amountTokenAccount, setAmountTokenAccount] = useState<number>();

    useEffect(() => {
        (async () => {
            const wallet = Keypair.generate();
            const airdropSignature = await connLocal.requestAirdrop(
                wallet.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(airdropSignature);

            // Create the token type with zero decimal place,
            const mint = await createMint(
                connLocal,
                wallet,
                wallet.publicKey,
                wallet.publicKey,
                0
            );

            // then create an account to hold tokens of this new type:
            const associatedTokenAccount =
                await getOrCreateAssociatedTokenAccount(
                    connLocal,
                    wallet,
                    mint,
                    wallet.publicKey
                );

            // Now mint only one token into the account
            await mintTo(
                connLocal,
                wallet,
                mint,
                associatedTokenAccount.address,
                wallet,
                1
            );

            // and disable future minting:
            let transaction = new Transaction().add(
                createSetAuthorityInstruction(
                    mint,
                    wallet.publicKey,
                    AuthorityType.MintTokens,
                    null
                )
            );
            await sendAndConfirmTransaction(connLocal, transaction, [wallet]);

            const accountInfo = await getAccount(
                connLocal,
                associatedTokenAccount.address
            );
            setAmountTokenAccount(Number(accountInfo.amount));
            console.log("associatedTokenAccount amount: ", accountInfo.amount);

            const mintInfo = await getMint(connLocal, mint);
            console.log("mintInfo: ", mintInfo);
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._7.title)}
            <p>
                <strong>Amount Token Account Info: </strong>
                <span>{amountTokenAccount}</span>
            </p>
            <div className="cli_command">
                <strong>CLI: </strong>
                <p>
                    <span>
                        - 1. Create the token type with zero decimal place
                    </span>
                    <code>spl-token create-token --decimals 0</code>
                </p>
                <p>
                    <span>
                        - 2. then create an account to hold tokens of this new
                        type:
                    </span>
                    <code>spl-token create-account `Token`</code>
                </p>
                <p>
                    <span>- 3. Now mint only one token into the account</span>
                    <code>spl-token mint `Token` 1 `Recipient`</code>
                </p>
                <p>
                    <span>- 4. Disable future minting:</span>
                    <code>spl-token authorize `Token` mint --disable</code>
                </p>
                <p>
                    <span>- 5. Info</span>
                    <code>spl-token account-info `Token`</code>
                </p>
                <p>
                    <span>- 6. Get supply token</span>
                    <code>spl-token supply `Token`</code>
                </p>
            </div>
        </section>
    );
};

export default CreateNFT;
