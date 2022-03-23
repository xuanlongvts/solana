import dynamic from 'next/dynamic';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const SwitchThemeMode = dynamic(() => import('themes/darkMode'), { ssr: false });

const Header = () => {
    return (
        <header>
            <WalletMultiButton />
            <SwitchThemeMode />
        </header>
    );
};

export default Header;
