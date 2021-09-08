import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import NoSsr from '@material-ui/core/NoSsr';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { green, pink } from '@material-ui/core/colors';
import Link from '@material-ui/core/Link';

import clsx from 'clsx';
import axios from 'axios';

import { transactionExplorer } from '_config';
import SidebarConfig from '_commComp/sidebar/consts';
import ButtonActs from '_commComp/btn';
import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import * as Selectors from 'components/02-create-account/slice/selector';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pink: {
            color: theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500],
        },
        green: {
            color: '#fff',
            backgroundColor: green[500],
        },
        boxShowNum: {
            display: 'flex',
            height: 50,
            alignItems: 'center',
        },
    }),
);

const SendGreetingPage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();
    const colors = useStyles();

    const [fetch, setFetch] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [greeterCount, setGreeterCount] = useState<number>(0);
    const [resetting, setResetting] = useState<boolean>(false);
    const [txhash, setTxhash] = useState<string>('');

    const greeterCode = useSelector(Selectors.selectGreeter_code);
    const getSecretkey = useSelector(Selectors.selectAccount_secret_key);
    const programId = useSelector(Selectors.selectProgram_id);

    useEffect(() => {
        setFetch(true);
        console.log('txhash: ', txhash);
        axios
            .post('/api/get-greetings', { greeterCode })
            .then(res => {
                setGreeterCount(res.data);
                setError(null);
                setFetch(false);
            })
            .catch(err => {
                setFetch(false);
                const { data } = err.response;
                setError(data);
            });
    }, [txhash]);

    const handleSubmit = () => {
        setResetting(true);
        setError(null);

        const dataSend = { greeterCode, secret: getSecretkey, programId };
        axios
            .post('/api/call-greeting', dataSend)
            .then(res => {
                console.log('res: ', res);
                setTxhash(res.data);
                setError(null);
                setResetting(false);
            })
            .catch(err => {
                setResetting(false);
                const { data } = err.response;
                setError(data);
            });
    };

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                {SidebarConfig[8].title}
            </Typography>
            <div className={classSelf.wrap}>
                <div className={clsx(classes.mBottom20, colors.boxShowNum)}>
                    <Typography variant="body2" gutterBottom>
                        Number of greetings:
                    </Typography>
                    <div style={{ marginLeft: 20 }}>
                        {fetch ? (
                            <CircularProgress color="inherit" size={20} />
                        ) : (
                            <Avatar className={colors.green}>{greeterCount}</Avatar>
                        )}
                    </div>
                </div>

                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={resetting ? <CircularProgress color="inherit" size={20} /> : null}
                    style={{ textTransform: 'initial' }}
                    onClick={handleSubmit}
                    className={classes.mBottom20}
                >
                    Send A Greeting
                </Button>

                {txhash ? (
                    <Alert severity="success" variant="outlined" className={clsx(classSelf.alertBox, classes.mTop16)}>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href={transactionExplorer(txhash)} target="_blank" rel="noreferrer">
                                View the transaction on Solana Explorer
                            </Link>
                        </Typography>
                    </Alert>
                ) : null}

                {error && (
                    <NoSsr>
                        <Alert severity="error" variant="outlined" className={clsx(classSelf.alertBox, classes.mTop16)}>
                            <Typography variant="h6" gutterBottom>
                                {error}
                            </Typography>
                        </Alert>
                    </NoSsr>
                )}
            </div>

            <ButtonActs prevLink={SidebarConfig[7].link} />
        </section>
    );
};

export default SendGreetingPage;
