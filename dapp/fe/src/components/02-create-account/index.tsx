import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import NoSsr from '@material-ui/core/NoSsr';
import { Theme, makeStyles } from '@material-ui/core/styles';

import axios from 'axios';

import useSpacing from 'assets/styles/useSpacing';
import ButtonActs from '_commComp/btn';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import SidebarConfig from '_commComp/sidebar/consts';

import { accountKeypairActions } from './slice';
import * as TYPES_KEYS from './slice/types';
import * as Selectors from './slice/selector';

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
    const classes = useSpacing();
    const classSelf = styles();
    const dispatch = useDispatch();

    const [fetch, setFetch] = useState<boolean>(false);

    const errMess = useSelector(Selectors.selectErrorMess);
    const address = useSelector(Selectors.selectAddress);

    const generateKeypair = async () => {
        dispatch(appLoadingActions.loadingOpen());
        try {
            setFetch(true);
            const result = await axios.get('/api/keypair');
            setFetch(false);

            const {
                data: { address, secret },
            } = result;

            dispatch(appLoadingActions.loadingClose());
            dispatch(
                accountKeypairActions.setAccount({
                    [TYPES_KEYS.ADDRESS_TO]: address,
                    [TYPES_KEYS.ACC_KEY_PAIR]: secret.toString(),
                }),
            );
        } catch (err) {
            dispatch(appLoadingActions.loadingClose());
            dispatch(accountKeypairActions.setErrorMess(err));
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

                {address ? (
                    <NoSsr>
                        <Alert severity="success" variant="outlined" className={classSelf.root}>
                            <Typography variant="h6" gutterBottom>
                                Keypair generated!
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                This is the string representation of the public key
                            </Typography>

                            <Typography variant="caption" gutterBottom>
                                <code>{address}</code>
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom className={classes.mTop32}>
                                Accessible (and copyable) at the top right of this page.
                            </Typography>
                        </Alert>
                    </NoSsr>
                ) : null}
                {errMess && (
                    <NoSsr>
                        <Alert severity="error" variant="outlined" className={classSelf.root}>
                            <Typography variant="h6" gutterBottom>
                                {errMess}
                            </Typography>
                        </Alert>
                    </NoSsr>
                )}
            </div>

            <ButtonActs prevLink={SidebarConfig[0].link} nextLink={SidebarConfig[2].link} />
        </section>
    );
};

export default ConnectPage;
