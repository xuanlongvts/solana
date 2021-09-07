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

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import * as Yup from 'yup';

import { accountExplorer } from '_config';
import { accountKeypairActions } from 'components/02-create-account/slice';
import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import SidebarConfig from '_commComp/sidebar/consts';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import { ENUM_FIELDS, program_id } from '_validate';
import ButtonActs from '_commComp/btn';

const AddressAccountSchema = Yup.object().shape({
    [ENUM_FIELDS.address_account]: program_id,
});

type T_HOOKS_FORM = {
    [ENUM_FIELDS.address_account]: string;
};
const DeployProgramPage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();
    const [fetch, setFetch] = useState<boolean>(false);
    const [checkedProgramId, setCheckedProgramId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOKS_FORM>({
        mode: 'onBlur',
        resolver: yupResolver(AddressAccountSchema),
    });

    const onSubmitForm = (data: T_HOOKS_FORM) => {
        dispatch(appLoadingActions.loadingOpen());
        setFetch(true);

        axios
            .post('/api/deploy-program', { programId: data[ENUM_FIELDS.address_account] })
            .then(res => {
                setCheckedProgramId(data[ENUM_FIELDS.address_account]);
                setError(null);
                setFetch(false);
                dispatch(accountKeypairActions.setProgramId(data[ENUM_FIELDS.address_account]));
                dispatch(appLoadingActions.loadingClose());
            })
            .catch(err => {
                setCheckedProgramId(null);
                dispatch(appLoadingActions.loadingClose());
                setFetch(false);
                setError('Unable to check ProgramId');
            });
    };

    const disabledBtn = !!(errors[ENUM_FIELDS.address_account] || !watch()[ENUM_FIELDS.address_account]);

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                {SidebarConfig[5].title}
            </Typography>
            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Typography variant="body2" gutterBottom>
                        Paste the <strong>programId</strong> generated after the deployement:
                    </Typography>
                </div>
                <form className={classes.mBottom20}>
                    <div style={{ width: 500 }}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.address_account}
                            label="Program ID"
                            placeholder="xxx"
                            type="text"
                            margin="normal"
                            {...register(ENUM_FIELDS.address_account)}
                            error={!!errors[ENUM_FIELDS.address_account]}
                            helperText={errors[ENUM_FIELDS.address_account]?.message}
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={fetch ? <CircularProgress color="inherit" size={20} /> : null}
                        style={{ textTransform: 'initial' }}
                        disabled={disabledBtn}
                        onClick={handleSubmit(onSubmitForm)}
                    >
                        Check programId
                    </Button>
                </form>

                {error && (
                    <NoSsr>
                        <Alert severity="error" variant="outlined" className={classSelf.alertBox}>
                            <Typography variant="h6" gutterBottom>
                                {error}
                            </Typography>
                        </Alert>
                    </NoSsr>
                )}

                {checkedProgramId ? (
                    <Alert severity="success" variant="outlined" className={classSelf.alertBox}>
                        <Typography variant="subtitle1" gutterBottom>
                            The program is correctly deployed!{' '}
                            <Link href={accountExplorer(checkedProgramId)} target="_blank" rel="noreferrer">
                                View on Solana Explorer
                            </Link>
                        </Typography>
                    </Alert>
                ) : null}
            </div>

            <ButtonActs prevLink={SidebarConfig[4].link} nextLink={SidebarConfig[6].link} />
        </section>
    );
};

export default DeployProgramPage;
