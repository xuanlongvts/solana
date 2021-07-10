import { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import Sender from 'components/sender';

function App() {
    const [dark, setDarkState] = useState<boolean>(useMediaQuery('(prefers-color-scheme: dark)'));

    const handleThemeChange = () => {
        setDarkState(!dark);
    };

    return (
        <ThemeProvider theme={theme(dark)}>
            <CssBaseline />
            <Container maxWidth="md">
                <Sender />
            </Container>
            <Switch checked={dark} onChange={handleThemeChange} />
        </ThemeProvider>
    );
}

export default App;
