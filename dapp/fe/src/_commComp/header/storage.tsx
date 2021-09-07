import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FileCopy from '@material-ui/icons/FileCopy';
import DoneIcon from '@material-ui/icons/Done';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import * as Selectors from 'components/02-create-account/slice/selector';
import * as TYPES_KEYS from 'components/02-create-account/slice/types';
import { accountKeypairActions } from 'components/02-create-account/slice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        kbd: {
            width: 150,
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginLeft: 10,
            marginRight: 20,
        },
        eachInfo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: theme.spacing(1),
        },
        cpyBox: {
            width: 22,
            height: 30,
            paddingTop: 5,
            textAlign: 'right',
        },
        cpy: {
            cursor: 'pointer',
        },
    }),
);

const initInfor = {
    [TYPES_KEYS.ADDRESS_TO]: {
        name: 'Address',
        val: '',
    },
    [TYPES_KEYS.ACC_KEY_PAIR]: {
        name: 'Keypair',
        val: '',
    },
    [TYPES_KEYS.PROGRAM_ID]: {
        name: 'Program id',
        val: '',
    },
};

const Storage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const address = useSelector(Selectors.selectAddress);
    const keypair = useSelector(Selectors.selectAccount_Keypair);
    const get_program_id = useSelector(Selectors.selectProgram_id);
    const key_cpy = useSelector(Selectors.selectAccoun_cpy);

    let [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (address && keypair) {
            initInfor[TYPES_KEYS.ADDRESS_TO].val = address;
            initInfor[TYPES_KEYS.ACC_KEY_PAIR].val = keypair;

            setCount(++count);
        }
        console.log('get_program_id: ', get_program_id);
        if (get_program_id) {
            initInfor[TYPES_KEYS.PROGRAM_ID].val = get_program_id;
            setCount(++count);
        }
    }, [address, keypair, get_program_id]);

    const timeOutCpy = (t: number) => {
        setTimeout(() => {
            dispatch(accountKeypairActions.setClearCpy());
        }, t);
    };

    const hanldeCpy = (filed: string) => {
        dispatch(accountKeypairActions.setCpy(filed));

        timeOutCpy(3000);
    };

    return (
        <>
            {Object.entries(initInfor).map(([k, v]) => {
                if (!v.val) {
                    return null;
                }
                return (
                    <div className={classes.eachInfo} key={k}>
                        <Typography variant="body2" gutterBottom>
                            {v.name}:
                        </Typography>{' '}
                        <kbd className={classes.kbd}>{v.val}</kbd>
                        <div className={classes.cpyBox}>
                            {key_cpy === k ? (
                                <DoneIcon />
                            ) : (
                                <CopyToClipboard text={v.val as string} onCopy={() => hanldeCpy(k)}>
                                    <FileCopy fontSize="small" className={classes.cpy} />
                                </CopyToClipboard>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Storage;
