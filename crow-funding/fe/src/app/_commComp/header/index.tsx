import { FC, ReactElement } from 'react';

import Typography from '@mui/material/Typography';
import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import { Theme } from '@mui/material/styles';
import Link from '@mui/material/Link';

import SwitchThemeMode from 'styles/darkMode';
import ImgLogo from 'imgs/logo.svg';
import { darkThemeModes } from 'styles/theme/const';

const StyledAppBar = withStyles({
    root: {
        '&.MuiAppBar-root': {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            height: '55px',
        },
    },
    title: {
        color: '#eeeeee',
    },
})(AppBar);

const useStyles = makeStyles((theme: Theme) => ({
    link: {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
        '&:hover': {
            color: `${theme.palette.mode === darkThemeModes.dark ? theme.palette.secondary.main : 'white'}`,
        },
    },
}));

const Header: FC = (): ReactElement => {
    const classes = useStyles();

    return (
        <StyledAppBar position="sticky">
            <SwitchThemeMode />

            <Link href="/" underline="none">
                <img src={ImgLogo} width={100} />
            </Link>

            <Link href="/create-campain" underline="none" color="inherit" className={classes.link}>
                <Typography variant="body2">Create campain</Typography>
            </Link>
        </StyledAppBar>
    );
};

export default Header;
