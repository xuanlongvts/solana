// import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { WalletMultiButton } from '@solana/wallet-adapter-material-ui';

// const SwitchThemeMode = dynamic(() => import('themes/darkMode'), { ssr: false });

const Header = () => {
    return (
        <header>
            <Link href="/">
                <a className="logo">
                    <Image src="/imgs/SolanaPayLogo.svg" alt="Solana Pay" width={100} height={50} />
                </a>
            </Link>
            {/* <WalletMultiButton /> */}
            {/* <SwitchThemeMode /> */}
        </header>
    );
};

export default Header;
