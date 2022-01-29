// import dynamic from 'next/dynamic';

import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// const SwitchThemeMode = dynamic(() => import('themes/darkMode'), { ssr: false });

const Header = () => {
    return (
        <header>
            {/* <SwitchThemeMode /> */}
            <WalletMultiButton />
        </header>
    );
};

export default Header;
