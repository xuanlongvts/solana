import { useEffect, useState } from "react";
import {
    createMint,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    getMint,
    createMultisig,
} from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, Signer } from "@solana/web3.js";

import { connLocal } from "_consts";
import LinkNavs from "_consts/link_nav";
import { HeaderElement } from "_comps";

const CreateNFT = () => {
    const [supply, setSupplyTokenMint] = useState<number>();

    useEffect(() => {
        (async () => {
            const signer1 = Keypair.generate();
            const signer2 = Keypair.generate();
            const signer3 = Keypair.generate();

            const airdropSignature = await connLocal.requestAirdrop(
                signer1.publicKey,
                LAMPORTS_PER_SOL * 2
            );
            await connLocal.confirmTransaction(airdropSignature);

            console.log(signer1.publicKey.toBase58());
            console.log(signer2.publicKey.toBase58());
            console.log(signer3.publicKey.toBase58());

            const multisigKey = await createMultisig(
                connLocal,
                signer1,
                [signer1.publicKey, signer2.publicKey, signer3.publicKey],
                2
            );
            console.log("Created 2/3 multisig: ", multisigKey);

            // Next create the token mint and receiving accounts as previously described and set the mint account's minting authority to the multisig account
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
            // To demonstrate that the mint account is now under control of the multisig account, attempting to mint with one multisig signer fails
            try {
                await mintTo(
                    connLocal,
                    signer1,
                    mint,
                    associatedTokenAccount.address,
                    multisigKey,
                    1
                );
            } catch (err) {
                console.log("Error when 1 signature: ", err);
            }

            // But repeating with a second multisig signer, succeeds
            try {
                await mintTo(
                    connLocal,
                    signer1,
                    mint,
                    associatedTokenAccount.address,
                    multisigKey,
                    1,
                    [signer1, signer2]
                );
            } catch (err) {
                console.log("Error when 1 signature: ", err);
            }
            const mintInfo = await getMint(connLocal, mint);
            setSupplyTokenMint(Number(mintInfo.supply));
            console.log(`Minted ${mintInfo.supply} token`);
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._8.title)}
            <p>
                <strong>Supply of mint token with multi signer: </strong>
                <span>{supply}</span>
            </p>
        </section>
    );
};
export default CreateNFT;
