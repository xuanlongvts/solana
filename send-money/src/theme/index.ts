import { createTheme } from '@material-ui/core/styles';
import { orange, lightBlue, deepPurple, deepOrange } from '@material-ui/core/colors';

// Create a theme instance.
const theme = (dark: boolean) =>
    createTheme({
        palette: {
            type: dark ? 'dark' : 'light',
            primary: {
                main: dark ? orange[500] : lightBlue[500],
            },
            secondary: {
                main: dark ? deepOrange[900] : deepPurple[500],
            },
        },
    });

export default theme;
