import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";
import kp from "./keypair.json";

import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// eslint-disable-next-line no-unused-vars
const TEST_GIFS = [
    "https://media0.giphy.com/media/uA8WItRYSRkfm/giphy.gif?cid=ecf05e47g6r5t7k09hmhohxvymfuodup2832s672wabc7dyj&rid=giphy.gif&ct=g",
    "https://media0.giphy.com/media/l0HlIo3bPNiMUABt6/giphy.gif?cid=ecf05e47drauv5wddftgwwskb0fhafojywkcnkqb5zbn40a2&rid=giphy.gif&ct=g",
    "https://media1.giphy.com/media/3o7qE5866bLg4VKabe/giphy.gif?cid=ecf05e47empewco9pqereqbskx884bdy8znheomavixscise&rid=giphy.gif&ct=g",
    "https://media4.giphy.com/media/3o85xGocUH8RYoDKKs/giphy.gif?cid=ecf05e47e0koye0jribiackem5pdvlh8iewf950zkrouq752&rid=giphy.gif&ct=g",
];

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

// Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id form the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devent.
const network = clusterApiUrl("devnet");

// Control's how we want to acknowledge when a trasnaction is "done".
const opts = {
    preflightCommitment: "processed",
};

const App = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [gifList, setGifList] = useState(null);

    const handleCheckWalletConnect = async () => {
        try {
            const { solana } = window;
            if (solana?.isPhantom) {
                console.log("Phantom wallet found!");

                const res = await solana.connect({ onlyIfTrusted: true });
                console.log(
                    "Connected with Public Key:",
                    res.publicKey.toString()
                );
                setWalletAddress(res.publicKey.toString());
            } else {
                alert("Solana object not found! Get a Phantom Wallet");
            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    const connectWallet = async () => {
        const { solana } = window;
        if (solana) {
            const res = await solana.connect();
            console.log("res: ", res.publicKey.toString());
            setWalletAddress(res.publicKey.toString());
        }
    };

    const renderNotConnectedContainer = () => (
        <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
        >
            Connect to Wallet
        </button>
    );

    const onInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
    };

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
            connection,
            window?.solana,
            opts?.preflightCommitment
        );
        return provider;
    };

    const sendGif = async () => {
        if (!inputValue.length) {
            console.log("No gif link given!");
            return false;
        }
        console.log("Gif link:", inputValue);
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);

            await program.rpc.addGif(inputValue, {
                accounts: {
                    baseAccount: baseAccount.publicKey,
                },
            });
            console.log("GIF sucesfully sent to program", inputValue);

            await getGifList();
        } catch (error) {
            console.log("Error sending GIF:", error);
        }
    };

    const handleLike = async (linkImg) => {
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);

            await program.rpc.updateVotes(
                linkImg.toString(),
                baseAccount.publicKey.toString(),
                {
                    accounts: {
                        baseAccount: baseAccount.publicKey,
                    },
                }
            );
            await getGifList();
        } catch (err) {
            console.log("err handleLike: ", err);
        }
    };

    const createGifAccount = async () => {
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);
            console.log("ping", program);
            await program.rpc.startStuffOff({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [baseAccount],
            });
            console.log(
                "Created a new BaseAccount address:",
                baseAccount.publicKey.toString()
            );
            await getGifList();
        } catch (error) {
            console.log("Error creating BaseAccount account:", error);
        }
    };

    const renderConnectedContainer = () => {
        if (!gifList) {
            return (
                <div className="connected-container">
                    <button
                        className="cta-button submit-gif-button"
                        onClick={createGifAccount}
                    >
                        Do One-Time Initialization For GIF Program Account
                    </button>
                </div>
            );
        } else {
            return (
                <div className="connected-container">
                    <input
                        type="text"
                        placeholder="Enter gif link!"
                        value={inputValue}
                        onChange={onInputChange}
                    />
                    <button
                        className="cta-button submit-gif-button"
                        onClick={sendGif}
                    >
                        Submit
                    </button>
                    <div className="gif-grid">
                        {gifList.map((item, index) => (
                            <div className="gif-item" key={index}>
                                <img src={item.gifLink} alt={item.gifLink} />
                                <p className="lbl-content">
                                    <strong>Upload by address: </strong>
                                    <span>{item.userAddress.toString()}</span>
                                </p>
                                <p className="lbl-content">
                                    <strong
                                        className="like"
                                        onClick={() => handleLike(item.gifLink)}
                                    >
                                        👍 &nbsp;&nbsp;
                                    </strong>
                                    <span> {item.votes.likes}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };
    // https://html-css-js.com/html/character-codes/icons/

    const getGifList = async () => {
        try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);

            const account = await program.account.baseAccount.fetch(
                baseAccount.publicKey
            );

            console.log("Got the account", account);
            setGifList(account.gifList);
        } catch (error) {
            console.log("Error in getGifs: ", error);
            setGifList(null);
        }
    };

    useEffect(() => {
        window.addEventListener("load", async (e) => {
            await handleCheckWalletConnect();
        });
    }, []);

    useEffect(() => {
        if (walletAddress) {
            console.log("Fetching GIF list...");
            getGifList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress]);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">Solana go to the moon</p>
                    {!walletAddress
                        ? renderNotConnectedContainer()
                        : renderConnectedContainer()}
                </div>
                <div className="footer-container">
                    <img
                        alt="Twitter Logo"
                        className="twitter-logo"
                        src={twitterLogo}
                    />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
