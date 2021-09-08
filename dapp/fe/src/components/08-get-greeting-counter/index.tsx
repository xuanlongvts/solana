import { useState } from 'react';
import type { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import NoSsr from '@material-ui/core/NoSsr';
import clsx from 'clsx';
import axios from 'axios';

import SidebarConfig from '_commComp/sidebar/consts';
import ButtonActs from '_commComp/btn';
import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import * as Selectors from 'components/02-create-account/slice/selector';

const GetGreetingCounterPage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();
    const dispatch = useDispatch();

    const [fetch, setFetch] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [greeterCount, setGreeterCount] = useState<number | null>(null);

    const greeterCode = useSelector(Selectors.selectGreeter_code);

    const handleSubmit = () => {
        dispatch(appLoadingActions.loadingOpen());
        setFetch(true);

        axios
            .post('/api/get-greetings', { greeterCode })
            .then(res => {
                console.log('res.data: ', res.data);
                setGreeterCount(res.data);
                setError(null);
                setFetch(false);
                dispatch(appLoadingActions.loadingClose());
            })
            .catch(err => {
                dispatch(appLoadingActions.loadingClose());
                setFetch(false);
                setGreeterCount(null);
                const { data } = err.response;
                setError(data);
            });
    };

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                {SidebarConfig[7].title}
            </Typography>
            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Typography variant="body2" gutterBottom>
                        Ask to the program the greeting's counter:
                    </Typography>
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
                    Get Greeting
                </Button>

                {error && (
                    <NoSsr>
                        <Alert severity="error" variant="outlined" className={clsx(classSelf.alertBox, classes.mTop16)}>
                            <Typography variant="h6" gutterBottom>
                                {error}
                            </Typography>
                        </Alert>
                    </NoSsr>
                )}

                {greeterCount || greeterCount === 0 ? (
                    <Alert severity="success" variant="outlined" className={clsx(classSelf.alertBox, classes.mTop16)}>
                        <Typography variant="subtitle1" gutterBottom>
                            The account have been greeted <strong>{greeterCount}</strong> times
                        </Typography>
                    </Alert>
                ) : null}
            </div>

            <ButtonActs prevLink={SidebarConfig[6].link} nextLink={SidebarConfig[8].link} />
        </section>
    );
};

export default GetGreetingCounterPage;
