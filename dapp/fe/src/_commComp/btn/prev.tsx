import { useRouter } from 'next/router';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowLeft from '@material-ui/icons/ArrowLeft';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: 'linear-gradient(253deg,#DC1FFF,#00FFA3)',
            textTransform: 'initial',
        },
    }),
);
type T_Btn = {
    href: string;
};
const PREV = ({ href }: T_Btn) => {
    const classes = useStyles();
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            className={classes.root}
            startIcon={<ArrowLeft fontSize="inherit" />}
        >
            Prev step
        </Button>
    );
};

export default PREV;
