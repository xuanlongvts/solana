import { useState } from 'react';
import type { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

import { accountExplorer } from '_config';
import { accountKeypairActions } from 'components/02-create-account/slice';
import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import SidebarConfig from '_commComp/sidebar/consts';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import { ENUM_FIELDS, program_id } from '_validate';
import ButtonActs from '_commComp/btn';
import * as Selectors from 'components/02-create-account/slice/selector';

const CreateAStoragePage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();
    const [fetch, setFetch] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();

    const get_program_id = useSelector(Selectors.selectProgram_id);

    const hanldeGreeter = () => {};

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
                <form className={classes.mBottom20}>
                    <div style={{ width: 500 }}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.address_account}
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
                        // onClick={handleSubmit(onSubmitForm)}
                    >
                        Create Greeter
                    </Button>
                </form>

                {/* {error && (
                    <NoSsr>
                        <Alert severity="error" variant="outlined" className={classSelf.alertBox}>
                            <Typography variant="h6" gutterBottom>
                                {error}
                            </Typography>
                        </Alert>
                    </NoSsr>
                )} */}

                {/* {checkedProgramId ? (
                    <Alert severity="success" variant="outlined" className={classSelf.alertBox}>
                        <Typography variant="subtitle1" gutterBottom>
                            The program is correctly deployed!{' '}
                            <Link href={accountExplorer(checkedProgramId)} target="_blank" rel="noreferrer">
                                View on Solana Explorer
                            </Link>
                        </Typography>
                    </Alert>
                ) : null} */}
            </div>

            <ButtonActs prevLink={SidebarConfig[5].link} nextLink={SidebarConfig[7].link} />
        </section>
    );
};

export default CreateAStoragePage;
