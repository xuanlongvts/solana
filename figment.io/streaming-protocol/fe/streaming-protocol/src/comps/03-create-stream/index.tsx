import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

import NoSsr from '@mui/material/NoSsr';

const CreateStreamComp: NextPage = () => {
    return (
        <section>
            <div className="sub-title">
                <Typography variant="h5" gutterBottom>
                    Stream Tokens
                </Typography>
                <Typography variant="caption" gutterBottom component="div">
                    Just follows two simple steps to start streaming SOL.
                </Typography>
            </div>

            <div className="content">aaa</div>
        </section>
    );
};

export default CreateStreamComp;
