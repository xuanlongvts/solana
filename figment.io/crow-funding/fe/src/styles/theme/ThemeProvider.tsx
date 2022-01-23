import { ReactChild, Children, forwardRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LinkProps } from '@mui/material/Link';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import { darkThemeModes } from 'styles/theme/const';
import { selectModeType } from 'styles/darkMode/slice/selector';

const LinkBehavior = forwardRef<any, Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }>((props, ref) => {
    const { href, ...other } = props;
    return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

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
        components: {
            MuiLink: {
                defaultProps: {
                    component: LinkBehavior,
                } as LinkProps,
            },
        },
    });

    return <ThemeProvider theme={darkTheme}>{Children.only(prop.children)}</ThemeProvider>;
};

export default ThemeProviderContainer;
