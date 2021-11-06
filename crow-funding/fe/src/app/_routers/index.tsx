import { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { Connection } from '@solana/web3.js';

import { getTransactions, TransactionWithSignature } from '_coreActions/transaction';
import { initWallet, WalletAdapter } from '_coreActions/wallet';
import Header from 'app/_commComp/header';

// import Header from 'app/_commComp/header';
import HomePage from 'app/pages/home';
import CreateCampainPage from 'app/pages/createCampain';
import history from './history';

function App() {
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
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-campain" element={<CreateCampainPage />} />

                <Route
                    path="*"
                    element={
                        <main style={{ padding: '1rem' }}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
