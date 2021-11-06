import { ReactChild, Children } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';

import { darkThemeModes } from 'styles/theme/const';
import { selectModeType } from 'styles/darkMode/slice/selector';

const ThemeProviderContainer = (prop: { children: ReactChild }) => {
    const darkState = useSelector(selectModeType) || useMediaQuery('(prefers-color-scheme: dark)');

    const darkTheme: Theme = createTheme({
        palette: {
            mode: darkState === darkThemeModes.dark ? darkThemeModes.dark : darkThemeModes.light,
            primary: {
                main: darkState === darkThemeModes.dark ? '#0276aa' : '#35baf6',
            },
            secondary: {
                main: darkState === darkThemeModes.dark ? '#00a0b2' : '#33eaff',
            },
        },
    });

    return <ThemeProvider theme={darkTheme}>{Children.only(prop.children)}</ThemeProvider>;
};

export default ThemeProviderContainer;
