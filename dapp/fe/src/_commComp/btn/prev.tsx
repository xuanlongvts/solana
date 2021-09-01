import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowRight from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: 'linear-gradient(253deg,#DC1FFF,#00FFA3)',
            textTransform: 'inherit',
        },
    }),
);
type T_Btn = {
    href: string;
};
const PREV = ({ href }: T_Btn) => {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            color="primary"
            href={href}
            className={classes.root}
            endIcon={<ArrowRight fontSize="inherit" />}
        >
            Prev step
        </Button>
    );
};

export default PREV;
