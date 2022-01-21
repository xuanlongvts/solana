import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';

import { I_RESULT_ALL_CAMPAINS } from 'app/solana';

const AllCampains = ({ datas }: { datas: Array<I_RESULT_ALL_CAMPAINS> }) => {
    // const { pubId, admin, name, description, image_link, amount_donated } = data;
    // https://mui.com/static/images/cards/contemplative-reptile.jpg
    return (
        <Grid container spacing={2}>
            {datas.map((item: I_RESULT_ALL_CAMPAINS) => {
                const { name, description, image_link, amount_donated } = item;
                return (
                    <Grid item container xs={12} md={6} lg={4} xl={3} style={{ justifyContent: 'center' }}>
                        <Card sx={{ minWidth: 360, maxWidth: 400 }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {description}
                                    </Typography>
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
