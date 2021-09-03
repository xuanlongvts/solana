import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import axios from 'axios';

import ButtonActs from '_commComp/btn';

const ConnectPage: NextPage = () => {
    const [version, setVersion] = useState<string | null>(null);
    const [fetch, setFetch] = useState<boolean>(false);

    useEffect(() => {
        setFetch(true);
        axios
            .get('/api/connect')
            .then(res => {
                const version = res.data;
                setVersion(version);
                setFetch(false);
            })
            .catch(err => {
                console.log('Catch Connect: ', err);
                setFetch(false);
            });
    }, []);

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                Connect to the Solana devnet cluster
            </Typography>
            {fetch ? (
                <Box alignSelf="center">
                    <CircularProgress color="inherit" />
                </Box>
            ) : version ? (
                <Alert severity="success" variant="outlined" style={{ alignItems: 'center' }}>
                    Connected to Solana: <Chip avatar={<Avatar>v</Avatar>} label={version} variant="outlined" />
                </Alert>
            ) : (
                <Alert severity="error" variant="outlined">
                    Not connected to Solana!
                </Alert>
            )}

            <ButtonActs nextLink="https://google.com.vn" />
        </section>
    );
};

export default ConnectPage;
