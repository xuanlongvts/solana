import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { Theme, makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

import useSpacing from 'assets/styles/useSpacing';
import ButtonActs from '_commComp/btn';
import SidebarConfig from '_commComp/sidebar/consts';

const styles = makeStyles((theme: Theme) => ({
    wrap: {
        height: '100%',
        padding: `${theme.spacing(2)}px 0`,
    },
    root: {
        '& .MuiAlert-icon': {
            paddingTop: 12,
        },
    },
}));

const ConnectPage: NextPage = () => {
    const [fetch, setFetch] = useState<boolean>(false);
    const [address, setAddress] = useState<string | null>(null);

    const classes = useSpacing();
    const classSelf = styles();

    const generateKeypair = async () => {
        try {
            setFetch(true);
            const result = await axios.get('/api/keypair');
            console.log('result: ', result);
            setFetch(false);
            setAddress(result.data.address);
        } catch (err) {
            console.log('Catch generateKeypair', err);
            setFetch(false);
        }
    };

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                Create an Account-Keypair
            </Typography>
            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={fetch ? <CircularProgress color="inherit" size={20} /> : null}
                        style={{ textTransform: 'initial' }}
                        onClick={generateKeypair}
                    >
                        Generate a Keypair
                    </Button>
                </div>
                {/* <Alert severity="success" variant="outlined" className={classSelf.root}>
                    <Typography variant="h6" gutterBottom>
                        Keypair generated!
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        This is the string representation of the public key
                    </Typography>

                    <Typography variant="caption" gutterBottom>
                        HHeZvcqm7XKdLVLmgzNVH5kTAtHurbbRcykKKPpgG8d3
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom className={classes.mTop32}>
                        Accessible (and copyable) at the top right of this page.
                    </Typography>
                </Alert> */}
                {address ? (
                    <Alert severity="success" variant="outlined" className={classSelf.root}>
                        <Typography variant="h6" gutterBottom>
                            Keypair generated!
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            This is the string representation of the public key
                        </Typography>

                        <Typography variant="caption" gutterBottom>
                            HHeZvcqm7XKdLVLmgzNVH5kTAtHurbbRcykKKPpgG8d3
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom className={classes.mTop32}>
                            Accessible (and copyable) at the top right of this page.
                        </Typography>
                    </Alert>
                ) : null}
            </div>

            <ButtonActs prevLink="/" nextLink="https://google.com.vn" />
        </section>
    );
};

export default ConnectPage;
