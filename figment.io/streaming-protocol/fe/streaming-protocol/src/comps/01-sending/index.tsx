import { useState, useEffect, SyntheticEvent, MouseEvent, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import { useWallet } from '@solana/wallet-adapter-react';

import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Grid from '@mui/material/Grid';
import NoSsr from '@mui/material/NoSsr';
import HelpIcon from '@mui/icons-material/Help';
import DoneIcon from '@mui/icons-material/Done';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { getStatus } from '_utils';
// import {} from '_config';

import { useSendingTypeSlice } from './slice';
import * as Selectors from './slice/selector';
import { T_ITEM } from './slice/types';

const steps = ['Started Streaming', 'In Progress', 'Ends'];

const SendingComp: NextPage = () => {
    const { actions } = useSendingTypeSlice();
    const dispatch = useDispatch();
    const wallet = useWallet();

    const [expanded, setExpanded] = useState<string | false>(false);

    const getDataSending = useSelector(Selectors.selectDataSending);

    useEffect(() => {
        if (wallet.publicKey) {
            dispatch(actions.getAllStreamsCall({ pubkey: wallet.publicKey.toString() }));
        }
    }, [wallet.publicKey]);

    const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    // --- popoverOpen
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    // --- step
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    return (
        <section>
            <div className="sub-title">
                <Typography variant="h5" gutterBottom>
                    History
                </Typography>
                <Typography variant="caption" gutterBottom component="div">
                    Check progress of your streams here.
                </Typography>
            </div>

            <div className="content">
                <div className="acts">
                    <NoSsr>
                        <FormControlLabel control={<Switch />} label="Streaming only" />
                        <Button variant="outlined">Refresh</Button>
                    </NoSsr>
                </div>
                <div className="tbl-wrap">
                    <Typography variant="subtitle2" gutterBottom component="div" align="center">
                        Connect wallet to view outgoing streams!
                    </Typography>

                    <div className="data-show">
                        {getDataSending?.sending.map((item: T_ITEM, index: number) => {
                            const {
                                amount_second,
                                end_time,
                                sender,
                                pda_account,
                                lamports_withdrawn,
                                start_time,
                                receiver,
                                total_amount,
                            } = item;
                            const dataStatus = {
                                start_time,
                                end_time,
                            };
                            const start_time_show = new Date(start_time * 1000).toUTCString();
                            const end_time_show = new Date(end_time * 1000).toUTCString();
                            return (
                                <Accordion
                                    expanded={expanded === `panel${index}`}
                                    onChange={handleChange(`panel${index}`)}
                                    key={index}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography sx={{ width: '10%', flexShrink: 0 }}>
                                            {getStatus(dataStatus)}
                                        </Typography>
                                        <Typography sx={{ width: '60%' }}>
                                            <strong>To:</strong>
                                            <br /> {receiver}{' '}
                                            <NoSsr>
                                                <DoneIcon sx={{ width: 20, height: 20 }} color="success" />
                                            </NoSsr>
                                        </Typography>
                                        <Typography sx={{ width: '10%' }}>
                                            <strong>Token:</strong>
                                            <br /> SOL{' '}
                                            <NoSsr>
                                                <DoneIcon sx={{ width: 20, height: 20 }} color="success" />
                                            </NoSsr>
                                        </Typography>
                                        <div style={{ width: '10%' }}>
                                            <strong>Amount:</strong>
                                            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                {total_amount}{' '}
                                                <Typography
                                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    onMouseEnter={handlePopoverOpen}
                                                    onMouseLeave={handlePopoverClose}
                                                >
                                                    <HelpIcon sx={{ width: 20, height: 20 }} />
                                                </Typography>
                                            </span>
                                            <Popover
                                                id="mouse-over-popover"
                                                sx={{
                                                    pointerEvents: 'none',
                                                }}
                                                open={open}
                                                anchorEl={anchorEl}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                onClose={handlePopoverClose}
                                                disableRestoreFocus
                                            >
                                                <Typography sx={{ p: 1 }}>
                                                    This is the total amount of tokens, <br />
                                                    Stream was created of. At the end <br />
                                                    of streaming time the withdraw <br />
                                                    amount will be equal to total amount.
                                                </Typography>
                                            </Popover>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        '& > :not(style)': {
                                                            m: 1,
                                                            width: '100%',
                                                            height: 70,
                                                        },
                                                    }}
                                                >
                                                    <Paper
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="caption" align="center">
                                                            Start time <br />
                                                            <strong>{start_time_show}</strong>
                                                        </Typography>
                                                    </Paper>
                                                    <Paper
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="caption" align="center">
                                                            End time <br />
                                                            <strong>{end_time_show}</strong>
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        '& > :not(style)': {
                                                            m: 1,
                                                            width: '100%',
                                                            height: 70,
                                                        },
                                                    }}
                                                >
                                                    <Paper
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="caption" align="center">
                                                            Withdrawn <br />
                                                            <strong>{lamports_withdrawn}</strong>
                                                        </Typography>
                                                    </Paper>
                                                    <Paper
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="caption" align="center">
                                                            Recipient <br />
                                                            <strong>{receiver}</strong>
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </Grid>
                                            <Grid xs={4} item>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Button variant="contained">Close Stream</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid>
                                            <Box sx={{ pt: 4 }}>
                                                <Stepper activeStep={activeStep}>
                                                    {steps.map((label, index) => {
                                                        const stepProps: { completed?: boolean } = {};
                                                        const labelProps: {
                                                            optional?: ReactNode;
                                                        } = {};
                                                        labelProps.optional = (
                                                            <Typography variant="caption">
                                                                {index === 1
                                                                    ? start_time_show
                                                                    : index === 2
                                                                    ? getStatus(dataStatus)
                                                                    : end_time_show}
                                                            </Typography>
                                                        );
                                                        if (isStepSkipped(index)) {
                                                            stepProps.completed = false;
                                                        }
                                                        return (
                                                            <Step key={label} {...stepProps}>
                                                                <StepLabel {...labelProps}>{label}</StepLabel>
                                                            </Step>
                                                        );
                                                    })}
                                                </Stepper>
                                            </Box>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SendingComp;
