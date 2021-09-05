import { useRouter } from 'next/router';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowRight from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: 'linear-gradient(253deg,#00FFA3,#DC1FFF)',
            textTransform: 'initial',
        },
    }),
);
type T_Btn = {
    href: string;
};
const NEXT = ({ href }: T_Btn) => {
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
            endIcon={<ArrowRight fontSize="inherit" />}
        >
            Next step
        </Button>
    );
};

export default NEXT;
