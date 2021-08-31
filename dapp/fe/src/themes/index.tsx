import { createTheme, Theme } from '@material-ui/core/styles';

import { darkThemeModes } from './const';

const Themes = (darkState: string): Theme =>
    createTheme({
        palette: {
            type: darkState === darkThemeModes.dark ? darkThemeModes.dark : darkThemeModes.light,
            primary: {
                main: darkState === darkThemeModes.dark ? '#0276aa' : '#35baf6',
            },
            secondary: {
                main: darkState === darkThemeModes.dark ? '#00a0b2' : '#33eaff',
            },
        },
    });

export default Themes;
