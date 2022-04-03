import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

import { connLocal, conn } from "_consts";
import LinkNavs from "_consts/link_nav";

import { HeaderElement } from "_comps";

/*
Use spl-token create token from 02_creating_your_own_fungible_token

In Commandline flow order

1. solana-keygen pubkey		(to get pubkey default of account in ~/.config/solana )
2. copy pubkey default to 
*/

const getPubkeyDefault = new PublicKey(
    "8JfcMmof6EH862WqtCufDEJXjXHbhM9N5q8rqu4ng9YW"
);

type T_TokenAccounts = {
    mint: string;
    amount: number;
};
const ViewAllTokensYouOwn = () => {
    const [tokenAccounts, setTokenAccountList] = useState<T_TokenAccounts[]>();

    useEffect(() => {
        (async () => {
            const tokenAccounts = await connLocal.getTokenAccountsByOwner(
                getPubkeyDefault,
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );

            const arrTokens: T_TokenAccounts[] = [];
            tokenAccounts.value.forEach((e) => {
                const accountInfo = AccountLayout.decode(e.account.data);

                arrTokens.push({
                    mint: new PublicKey(accountInfo.mint).toBase58(),
                    amount: Number(accountInfo.amount) / LAMPORTS_PER_SOL,
                });

                console.log(
                    `mint: ${new PublicKey(accountInfo.mint)}, amount: ${
                        accountInfo.amount
                    }`
                );
            });
            setTokenAccountList(arrTokens);
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._3.title)}
            <p>List TokenAccounts</p>
            <table>
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Number</th>
                    </tr>
                </thead>
                <tbody>
                    {tokenAccounts?.length &&
                        tokenAccounts.map((item, key) => (
                            <tr key={key}>
                                <td>{item.mint}</td>
                                <td>{item.amount}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="cli_command">
                <strong>CLI: </strong>
                <p>
                    <span>- Get all token accounts:</span>
                    <code>spl-token accounts</code>
                </p>
            </div>
        </section>
    );
};

export default ViewAllTokensYouOwn;
