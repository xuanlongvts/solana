/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import { useState, useEffect, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import { Connection } from '@solana/web3.js';

import theme from 'theme';
import Header from 'components/header';
import { getTransactions, TransactionWithSignature } from '_coreActions/transaction';

import Sender from 'components/sender';
import Transactions from 'components/transactions';

import { initWallet, WalletAdapter } from './_coreActions/wallet';

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    box: {
        width: 300,
    },
});

function App() {
    const classes = useStyles();

    const getDark = useMediaQuery('(prefers-color-scheme: dark)');

    const [dark, setDarkState] = useState<boolean>(getDark);
    const [transactions, setTransactions] = useState<Array<TransactionWithSignature>>();
    const [loadingConn, setLoadingConn] = useState<boolean>(false);
    const conn = useRef<Connection>();
    const wall = useRef<WalletAdapter>();

    useEffect(() => {
        initWallet().then(([connection, wallet]: [Connection, WalletAdapter]) => {
            console.log('connection: ', connection);
            console.log('wallet: ', wallet);
            setLoadingConn(true);
            conn.current = connection;
            wall.current = wallet;
            if (wallet.publicKey) {
                getTransactions(connection, wallet.publicKey).then(trans => {
                    setLoadingConn(false);

                    setTransactions(trans);
                });
            }
        });
    }, []);

    useEffect(() => {
        setDarkState(getDark);
    }, [getDark]);

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
                        {loadingConn ? (
                            <div className={classes.root}>
                                <Box className={classes.box} m={10}>
                                    <Skeleton />
                                    <Skeleton animation={false} />
                                    <Skeleton animation="wave" />
                                </Box>
                            </div>
                        ) : null}
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default App;
