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
                    <span className="img">
                        <Image src="/imgs/sol.jpg" alt="Solana Pay" width={32} height={32} />
                    </span>
                    <span className="txt">Pay</span>
                </a>
            </Link>
            {/* <WalletMultiButton /> */}
            {/* <SwitchThemeMode /> */}
        </header>
    );
};

export default Header;
