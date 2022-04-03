import { useEffect } from "react";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { HeaderElement } from "_comps";
import { conn } from "_consts";
import LinkNavs from "_consts/link_nav_cook_book";

const GetPDA = () => {
    console.log("TOKEN_PROGRAM_ID: ", TOKEN_PROGRAM_ID.toBase58());

    useEffect(() => {
        const MY_WALLET_ADDRESS =
            "FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T";

        (async () => {
            const accounts = await conn.getParsedProgramAccounts(
                TOKEN_PROGRAM_ID,
                {
                    filters: [
                        {
                            dataSize: 165, // number of bytes
                        },
                        {
                            memcmp: {
                                offset: 32, // number of bytes
                                bytes: MY_WALLET_ADDRESS, // base58 encoded string
                            },
                        },
                    ],
                }
            );
            console.log(
                `Found ${accounts.length} token account(s) for wallet ${MY_WALLET_ADDRESS}`
            );
            accounts.forEach((item, k) => {
                console.log(
                    `-- Token Account Address ${
                        k + 1
                    }: ${item.pubkey.toString()} --`
                );
                console.log("Info: ", item.account.data?.parsed?.info);
            });

            console.log("-----------------------------");
            const MY_TOKEN_MINT_ADDRESS =
                "BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf";
            const accounts_2 = await conn.getProgramAccounts(TOKEN_PROGRAM_ID, {
                dataSlice: {
                    offset: 0,
                    length: 0,
                },
                filters: [
                    {
                        dataSize: 165, // number of bytes
                    },
                    {
                        memcmp: {
                            offset: 0, // number of bytes
                            bytes: MY_TOKEN_MINT_ADDRESS, // base58 encoded string
                        },
                    },
                ],
            });
            console.log(
                `Found ${accounts_2.length} token account(s) for wallet ${MY_TOKEN_MINT_ADDRESS}`
            );
            accounts_2.forEach((item, k) => {
                console.log(
                    `-- Token Account Address ${
                        k + 1
                    }: ${item.pubkey.toString()} --`
                );
                console.log("Account: ", item);
            });
        })();
    }, []);

    return (
        <section>
            {HeaderElement(LinkNavs._1.title)}
            <p>
                <span>
                    By combining all three parameters (dataSlice, dataSize, and
                    memcmp) we can limit the scope of our query and efficiently
                    return only the data we’re interested in
                </span>
            </p>
        </section>
    );
};

export default GetPDA;
