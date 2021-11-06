import { FC, ReactElement } from 'react';

import { makeStyles, withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import { Theme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import { NavLink } from 'react-router-dom';

import SwitchThemeMode from 'styles/darkMode';
import ImgLogo from 'imgs/logo.svg';
import { darkThemeModes } from 'styles/theme/const';
import RoutersPath from 'app/_routers/consts';

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

            <Link href={RoutersPath.rHome} underline="none">
                <img src={ImgLogo} width={100} />
            </Link>

            <NavLink
                style={({ isActive }) => ({
                    fontWeight: isActive ? 600 : 400,
                })}
                to={RoutersPath.rCreateCampain}
                key="create_campain"
                className={classes.link}
            >
                Create campain
            </NavLink>
        </StyledAppBar>
    );
};

export default Header;
