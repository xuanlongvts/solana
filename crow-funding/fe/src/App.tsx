import { useState, useEffect, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { Connection } from '@solana/web3.js';

import theme from 'theme';
import { getTransactions, TransactionWithSignature } from '_coreActions/transaction';
import { initWallet, WalletAdapter } from '_coreActions/wallet';

import Header from 'components/header';

function App() {
    const getDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [dark, setDarkState] = useState<boolean>(getDark);
    const [transactions, setTransactions] = useState<Array<TransactionWithSignature>>();
    const [loadingConn, setLoadingConn] = useState<boolean>(false);
    const conn = useRef<Connection>();
    const wall = useRef<WalletAdapter>();

    // useEffect(() => {
    //     initWallet().then(([connection, wallet]: [Connection, WalletAdapter]) => {
    //         console.log('connection: ', connection);
    //         console.log('wallet: ', wallet);
    //         setLoadingConn(true);
    //         conn.current = connection;
    //         wall.current = wallet;
    //         if (wallet.publicKey) {
    //             getTransactions(connection, wallet.publicKey).then(trans => {
    //                 setLoadingConn(false);

    //                 setTransactions(trans);
    //             });
    //         }
    //     });
    // }, []);

    useEffect(() => {
        setDarkState(getDark);
    }, [getDark]);

    const handleThemeChange = () => {
        setDarkState(!dark);
    };

    return (
        <ThemeProvider theme={theme(dark)}>
            <CssBaseline />
            <Header dark={dark} handleThemeChange={handleThemeChange} />
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        Sender
                    </Grid>
                    <Grid item xs={12}>
                        Sender
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default App;
