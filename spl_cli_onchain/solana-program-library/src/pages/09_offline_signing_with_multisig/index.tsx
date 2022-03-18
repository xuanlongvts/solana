import { useEffect, useState } from "react";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    createMultisig,
    createMintToInstruction,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
    Keypair,
    LAMPORTS_PER_SOL,
    NONCE_ACCOUNT_LENGTH,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    NonceAccount,
    sendAndConfirmRawTransaction,
} from "@solana/web3.js";
import nacl from "tweetnacl";

import { connLocal } from "_consts";
import LinkNavs from "_consts/link_nav";
import { HeaderElement } from "_comps";

const OfflineSigning = () => {
    const [tx, setTx] = useState<string>();

    useEffect(() => {
        (async () => {
            const onlineAccount = Keypair.generate();
            const nonceAccount = Keypair.generate();

            const airdropSignature = await connLocal.requestAirdrop(
                onlineAccount.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(airdropSignature);

            const minimumAccount =
                await connLocal.getMinimumBalanceForRentExemption(
                    NONCE_ACCOUNT_LENGTH
                );

            // From CreateNonceAccount transaction
            const transaction = new Transaction().add(
                SystemProgram.createNonceAccount({
                    fromPubkey: onlineAccount.publicKey,
                    noncePubkey: nonceAccount.publicKey,
                    authorizedPubkey: onlineAccount.publicKey,
                    lamports: minimumAccount,
                })
            );
            await sendAndConfirmTransaction(connLocal, transaction, [
                onlineAccount,
                nonceAccount,
            ]);
            const nonceAccountData = await connLocal.getNonce(
                nonceAccount.publicKey,
                "confirmed"
            );
            console.log("nonceAccountData: ", nonceAccountData);

            /* 
				First a raw transaction is built using the nonceAccountInformation and tokenAccount key. 
				All signers of the transaction are noted as part of the raw transaction. 
				This transaction will be handed to the signers later for signing. 
			*/
            const nonceAccountInfor = await connLocal.getAccountInfo(
                nonceAccount.publicKey,
                "confirmed"
            );
            console.log("nonceAccountInfor: ", nonceAccountInfor);

            const nonceAccountFromInfo = NonceAccount.fromAccountData(
                nonceAccountInfor!.data
            );
            const nonceInstruction = SystemProgram.nonceAdvance({
                authorizedPubkey: onlineAccount.publicKey,
                noncePubkey: nonceAccount.publicKey,
            });
            const nonce = nonceAccountFromInfo.nonce; // Blockhash

            const signer1 = Keypair.generate();
            const airdropSignatureSigner1 = await connLocal.requestAirdrop(
                signer1.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(airdropSignatureSigner1);
            const multisigKey = await createMultisig(
                connLocal,
                signer1,
                [
                    signer1.publicKey,
                    onlineAccount.publicKey,
                    nonceAccount.publicKey,
                ],
                2
            );
            const mint = await createMint(
                connLocal,
                signer1,
                multisigKey,
                multisigKey,
                9
            );
            const associatedTokenAccount =
                await getOrCreateAssociatedTokenAccount(
                    connLocal,
                    signer1,
                    mint,
                    signer1.publicKey
                );

            const mintToTransaction = new Transaction({
                feePayer: onlineAccount.publicKey,
                nonceInfo: { nonce, nonceInstruction },
            }).add(
                createMintToInstruction(
                    mint,
                    associatedTokenAccount.address,
                    multisigKey,
                    1,
                    [signer1, onlineAccount],
                    TOKEN_PROGRAM_ID
                )
            );
            console.log("mintToTransaction: ", mintToTransaction);

            // Next each offline signer will take the transaction buffer and sign it with their corresponding key.
            const mintToTransactionBuffer =
                mintToTransaction.serializeMessage();
            const onlineSIgnature = nacl.sign.detached(
                mintToTransactionBuffer,
                onlineAccount.secretKey
            );
            mintToTransaction.addSignature(
                onlineAccount.publicKey,
                Buffer.from(onlineSIgnature)
            );

            // Handed to offline signer for signature
            const offlineSignature = nacl.sign.detached(
                mintToTransactionBuffer,
                signer1.secretKey
            );
            mintToTransaction.addSignature(
                signer1.publicKey,
                Buffer.from(offlineSignature)
            );
            const rawMintToTransaction = mintToTransaction.serialize();

            // Send to online signer for broadcast to network
            const confirmTran = await sendAndConfirmRawTransaction(
                connLocal,
                rawMintToTransaction
            );
            setTx(confirmTran);
            console.log("DONE: confirmTran: ===> ", confirmTran);
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._9.title)}
            <p>
                <strong>
                    Send to online signer for broadcast to network:{" "}
                </strong>
                <span>{tx}</span>
            </p>
        </section>
    );
};

export default OfflineSigning;
