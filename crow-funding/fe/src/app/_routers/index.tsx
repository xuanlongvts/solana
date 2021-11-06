import { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { Connection } from '@solana/web3.js';

import { getTransactions, TransactionWithSignature } from '_coreActions/transaction';
import { initWallet, WalletAdapter } from '_coreActions/wallet';

import Header from 'app/_commComp/header';

function App() {
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

    return (
        <>
            <Header />
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
        </>
    );
}

export default App;
