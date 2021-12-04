import { useEffect, useState } from 'react';
import Head from 'next/head';

import Image from 'next/image';

import Ball_0 from '../assets/ball_0.png';
import Ball_1 from '../assets/ball_1.png';
import Ball_2 from '../assets/ball_2.png';

export default function Home() {
    const [walletAddress, setWalletAddress] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;

            if (solana) {
                if (solana.isPhantom) {
                    console.log('Phantom wallet found!');
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log('Connected with Public Key:', response.publicKey.toString());

                    setWalletAddress(response.publicKey.toString());
                }
            } else {
                alert('Solana object not found! Get a Phantom Wallet 👻');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log('Connected with Public Key:', response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        }
    };

    const renderNotConnectedContainer = () => (
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect to Wallet
        </button>
    );

    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
    }, []);

    return (
        <main>
            <Head>
                <title>NFT on Solana</title>
                <meta name="description" content="NFT on Solana by xuanlongvts@gmail.com" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <section className="App">
                <div className="container">
                    <div className="header-container">
                        <p className="header">🍭 Candy Drop</p>
                        <p className="sub-text">NFT drop machine with fair mint</p>
                        {!walletAddress && renderNotConnectedContainer()}
                    </div>

                    <div className="collections">
                        <Image src={Ball_0} alt="Ball 1" quality={100} width={236} height={235} />
                        <Image src={Ball_1} alt="Ball 2" quality={100} width={301} height={336} />
                        <Image src={Ball_2} alt="Ball 3" quality={100} width={320} height={303} />
                    </div>
                </div>
            </section>
        </main>
    );
}
