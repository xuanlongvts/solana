import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import useMediaQuery from '@mui/material/useMediaQuery';

import { I_RESULT_ALL_CAMPAINS } from 'app/solana';
import FrmDonate from './frm_donate';
import FrmWithDraw from './frm_withdraw';
import { ONE_SOL_UNIT } from './const';

const AllCampains = ({ datas }: { datas: Array<I_RESULT_ALL_CAMPAINS> }) => {
    const matches = useMediaQuery('(max-width:450px)');
    // const { pubId, admin, name, description, image_link, amount_donated } = data;
    const imgDefault = 'https://source.unsplash.com/random';
    return (
        <Grid container spacing={2}>
            {datas.map((item: I_RESULT_ALL_CAMPAINS, index: number) => {
                const { pubId, name, description, image_link, amount_donated } = item;

                const transferSOL = Number(amount_donated.toString()) * ONE_SOL_UNIT;

                let imgLink = imgDefault;
                if (image_link.search('http') >= 0) {
                    imgLink = image_link;
                }
                return (
                    <Grid item container xs={12} md={6} lg={4} style={{ justifyContent: 'center' }} key={index}>
                        <Card sx={{ width: matches ? 320 : 450 }}>
                            <CardMedia component="img" height="140" image={imgLink} alt={name} />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    <label>Title campain: </label>
                                    {name}
                                </Typography>
                                <Typography gutterBottom variant="caption" component="div">
                                    <label>Amount Donateds: </label>
                                    <strong>{transferSOL}</strong> Sol
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Description: </strong>
                                    {description}
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <FrmDonate pubId={pubId} />
                                <FrmWithDraw pubId={pubId} />
                                <Typography variant="overline" color="text.secondary">
                                    Only admin can withdraw
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default AllCampains;
