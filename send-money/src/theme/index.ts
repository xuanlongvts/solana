import { createTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = (dark: boolean) =>
    createTheme({
        palette: {
            type: dark ? 'dark' : 'light',
            primary: {
                main: dark ? '#0276aa' : '#35baf6',
            },
            secondary: {
                main: dark ? '#00a0b2' : '#33eaff',
            },
        },
    });

export default theme;
