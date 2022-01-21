import { ChangeEvent } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import useMediaQuery from '@mui/material/useMediaQuery';

import { I_RESULT_ALL_CAMPAINS } from 'app/solana';
import FrmDonate from './frm_donate';
import FrmWithDraw from './frm_withdraw';

const AllCampains = ({ datas }: { datas: Array<I_RESULT_ALL_CAMPAINS> }) => {
    const matches = useMediaQuery('(max-width:450px)');

    // const { pubId, admin, name, description, image_link, amount_donated } = data;
    // https://mui.com/static/images/cards/contemplative-reptile.jpg
    return (
        <Grid container spacing={2}>
            {datas.map((item: I_RESULT_ALL_CAMPAINS, index: number) => {
                const { name, description, image_link } = item;
                return (
                    <Grid item container xs={12} md={6} lg={4} style={{ justifyContent: 'center' }} key={index}>
                        <Card sx={{ width: matches ? 320 : 450 }}>
                            <CardActionArea>
                                <CardMedia component="img" height="140" image={image_link} alt={name} />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {description}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <FrmDonate />
                                    <FrmWithDraw />
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default AllCampains;
