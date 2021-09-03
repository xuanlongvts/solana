import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import axios from 'axios';

import ButtonActs from '_commComp/btn';

const ConnectPage: NextPage = () => {
    return (
        <section>
            <Typography variant="h5" gutterBottom>
                Create an Account/Keypair
            </Typography>

            <ButtonActs prevLink="/" nextLink="https://google.com.vn" />
        </section>
    );
};

export default ConnectPage;
