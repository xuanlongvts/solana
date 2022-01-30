import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import NoSsr from '@mui/material/NoSsr';

const SendingComp: NextPage = () => {
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
                        <Button variant="outlined" href="#outlined-buttons">
                            Refresh
                        </Button>
                    </NoSsr>
                </div>
                <div className="tbl-wrap">
                    <Typography variant="subtitle2" gutterBottom component="div" align="center">
                        Connect wallet to view outgoing streams!
                    </Typography>
                </div>
            </div>
        </section>
    );
};

export default SendingComp;
