import type { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';

import ButtonActs from '_commComp/btn';

const ConnectPage: NextPage = () => {
    return (
        <section>
            <Typography variant="h5" gutterBottom>
                Connect to the Solana devnet cluster
            </Typography>

            <ButtonActs nextLink="https://google.com.vn" />
        </section>
    );
};

export default ConnectPage;
