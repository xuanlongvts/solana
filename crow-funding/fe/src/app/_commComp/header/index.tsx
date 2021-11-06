import { FC, ReactElement } from 'react';

import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';

import SwitchThemeMode from 'styles/darkMode';

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

const Header: FC = (): ReactElement => {
    return (
        <StyledAppBar position="sticky">
            <SwitchThemeMode />

            <Typography variant="h6" gutterBottom>
                Create campain
            </Typography>
        </StyledAppBar>
    );
};

export default Header;
