/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import { useState, useEffect, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { Connection } from '@solana/web3.js';

import theme from 'theme';
import Header from 'components/header';
import { getTransactions, TransactionWithSignature } from '_coreActions/transaction';

import Sender from 'components/sender';
import Transactions from 'components/transactions';

import { initWallet, WalletAdapter } from './_coreActions/wallet';

function App() {
    const [dark, setDarkState] = useState<boolean>(useMediaQuery('(prefers-color-scheme: dark)'));
    const [transactions, setTransactions] = useState<Array<TransactionWithSignature>>();
    const conn = useRef<Connection>();
    const wall = useRef<WalletAdapter>();

    useEffect(() => {
        initWallet().then(([connection, wallet]: [Connection, WalletAdapter]) => {
            console.log('connection: ', connection);
            console.log('wallet: ', wallet);
            conn.current = connection;
            wall.current = wallet;
            if (wallet.publicKey) {
                getTransactions(connection, wallet.publicKey).then(trans => {
                    setTransactions(trans);
                });
            }
        });
    }, []);

    const didSendMoney = () => {
        conn.current &&
            wall?.current?.publicKey &&
            getTransactions(conn.current!, wall.current!.publicKey!).then(trans => {
                setTransactions(trans);
            });
    };

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
                        <Sender didSendMoney={didSendMoney} />
                    </Grid>
                    <Grid item xs={12}>
                        {transactions && <Transactions trans={transactions} />}
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default App;
