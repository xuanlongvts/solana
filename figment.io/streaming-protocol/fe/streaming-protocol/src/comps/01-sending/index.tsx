import { useState, SyntheticEvent, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';

import NoSsr from '@mui/material/NoSsr';
import Chip from '@mui/material/Chip';
import HelpIcon from '@mui/icons-material/Help';
import DoneIcon from '@mui/icons-material/Done';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getStatus } from '_utils';

import { useSendingTypeSlice } from './slice';
import * as Selectors from './slice/selector';
import { T_ITEM } from './slice/types';

const SendingComp: NextPage = () => {
    const { actions } = useSendingTypeSlice();
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState<string | false>(false);

    const getDataSending = useSelector(Selectors.selectDataSending);

    console.log('getDataSending: ', getDataSending);

    const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
                                            <DoneIcon sx={{ width: 20, height: 20 }} color="success" />
                                        </Typography>
                                        <Typography sx={{ width: '10%' }}>
                                            <strong>Token:</strong>
                                            <br /> SOL <DoneIcon sx={{ width: 20, height: 20 }} color="success" />
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
                                        <Typography>
                                            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam
                                            eget maximus est, id dignissim quam.
                                        </Typography>
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
