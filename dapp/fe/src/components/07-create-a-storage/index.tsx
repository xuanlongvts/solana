import { useState } from 'react';
import type { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import NoSsr from '@material-ui/core/NoSsr';
import clsx from 'clsx';
import axios from 'axios';

import { accountExplorer, transactionExplorer } from '_config';
import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import SidebarConfig from '_commComp/sidebar/consts';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import { accountKeypairActions } from 'components/02-create-account/slice';
import { ENUM_FIELDS } from '_validate';
import ButtonActs from '_commComp/btn';
import * as Selectors from 'components/02-create-account/slice/selector';

const CreateAStoragePage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();
    const [fetch, setFetch] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);
    const [greeter, setGreeter] = useState<string | null>(null);

    const dispatch = useDispatch();

    const get_program_id = useSelector(Selectors.selectProgram_id);
    const get_secret = useSelector(Selectors.selectAccount_secret_key);

    const handleSubmit = () => {
        const dataSend = {
            programId: get_program_id,
            secret: get_secret,
        };
        dispatch(appLoadingActions.loadingOpen());
        setFetch(true);

        axios
            .post('/api/greeter', { ...dataSend })
            .then(res => {
                const { greeter, hash } = res.data;
                setHash(hash);
                setGreeter(greeter);
                setError(null);
                setFetch(false);
                dispatch(accountKeypairActions.setGreeterCode(greeter));
                dispatch(appLoadingActions.loadingClose());
            })
            .catch(err => {
                dispatch(appLoadingActions.loadingClose());
                setFetch(false);
                setHash(null);
                setGreeter(null);
                const { data } = err.response;
                setError(data);
            });
    };

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                {SidebarConfig[6].title}
            </Typography>
            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Typography variant="body2" gutterBottom>
                        We're going to derive the greeter Account from programId
                    </Typography>
                </div>
                <div style={{ width: 500 }} className={classes.mBottom20}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        id={ENUM_FIELDS.program_id}
                        placeholder="xxx"
                        value={get_program_id}
                        disabled
                        type="text"
                        margin="normal"
                    />
                </div>
                <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={fetch ? <CircularProgress color="inherit" size={20} /> : null}
                    style={{ textTransform: 'initial' }}
                    onClick={handleSubmit}
                    className={classes.mBottom20}
                >
                    Create Greeter
                </Button>

                {error && (
                    <NoSsr>
                        <Alert severity="error" variant="outlined" className={classSelf.alertBox}>
                            <Typography variant="h6" gutterBottom>
                                {error}
                            </Typography>
                        </Alert>
                    </NoSsr>
                )}

                {hash ? (
                    <Alert severity="success" variant="outlined" className={classSelf.alertBox}>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href={transactionExplorer(hash)} target="_blank" rel="noreferrer">
                                View the transaction on Solana Explorer
                            </Link>
                        </Typography>
                    </Alert>
                ) : null}

                {greeter ? (
                    <Alert severity="success" variant="outlined" className={clsx(classSelf.alertBox, classes.mTop16)}>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href={accountExplorer(greeter)} target="_blank" rel="noreferrer">
                                View the Account on Solana Explorer
                            </Link>
                        </Typography>
                    </Alert>
                ) : null}
            </div>

            <ButtonActs prevLink={SidebarConfig[5].link} nextLink={SidebarConfig[7].link} />
        </section>
    );
};

export default CreateAStoragePage;
