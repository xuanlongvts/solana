import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import ButtonNext from './next';
import ButtonPrev from './prev';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
        },
    }),
);

type T_ACTS = {
    nextLink?: string;
    prevLink?: string;
};

const Acts_Next_Prev = ({ nextLink, prevLink }: T_ACTS) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {prevLink ? <ButtonPrev href={prevLink} /> : <span />}
            {nextLink ? <ButtonNext href={nextLink} /> : null}
        </div>
    );
};

export default Acts_Next_Prev;
