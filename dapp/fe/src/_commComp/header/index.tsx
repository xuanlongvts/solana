import SwitchThemeMode from 'themes/darkMode';

const Header = () => {
    return (
        <header>
            <SwitchThemeMode />
            <div>Select Network</div>
        </header>
    );
};

export default Header;
