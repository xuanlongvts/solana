import { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { Connection } from '@solana/web3.js';

import { getTransactions, TransactionWithSignature } from '_coreActions/transaction';
import { initWallet, WalletAdapter } from '_coreActions/wallet';
import Header from 'app/_commComp/header';
import useSpacing from '_styles/useSpacing';

// import Header from 'app/_commComp/header';
import HomePage from 'app/pages/home';
import CreateCampainPage from 'app/pages/createCampain';
import RoutersPath from './consts';

function App() {
    const spacing = useSpacing();

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

    return (
        <BrowserRouter>
            <Header />
            <Container maxWidth="md" className={spacing.mTop24}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Routes>
                            <Route path={RoutersPath.rHome} element={<HomePage />} />
                            <Route path={RoutersPath.rCreateCampain} element={<CreateCampainPage />} />

                            <Route
                                path="*"
                                element={
                                    <div style={{ padding: '1rem' }}>
                                        <p>There's nothing here!</p>
                                    </div>
                                }
                            />
                        </Routes>
                    </Grid>
                </Grid>
            </Container>
        </BrowserRouter>
    );
}

export default App;
