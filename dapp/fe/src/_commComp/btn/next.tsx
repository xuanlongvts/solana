import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowRight from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: 'linear-gradient(253deg,#00FFA3,#DC1FFF)',
            textTransform: 'inherit',
        },
    }),
);
type T_Btn = {
    href: string;
};
const NEXT = ({ href }: T_Btn) => {
    const classes = useStyles();

    return (
        <Button
            variant="contained"
            color="primary"
            href={href}
            className={classes.root}
            endIcon={<ArrowRight fontSize="inherit" />}
        >
            Next step
        </Button>
    );
};

export default NEXT;
