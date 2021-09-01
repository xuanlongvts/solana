import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { darkThemeModes } from 'themes/const';
import navConfig from './consts';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            color:
                theme.palette.type === darkThemeModes.dark
                    ? theme.palette.primary.dark
                    : theme.palette.secondary.contrastText,
        },
        order: {
            width: 25,
            height: 25,
            borderRadius: '50%',
            minWidth: 'auto',
            display: 'inline-block',
            marginRight: theme.spacing(1),
            border: `1px solid ${theme.palette.primary.contrastText}`,
            lineHeight: '23px',
            textAlign: 'center',
            color: theme.palette.secondary.contrastText,
        },
    }),
);

const ListItemLink = (props: ListItemProps<'a', { button?: true }>) => <ListItem button component="a" {...props} />;

const Sidebar = () => {
    const classes = useStyles();

    return (
        <aside>
            <Typography variant="h4" align="center" gutterBottom className={classes.title}>
                Solana DApp
            </Typography>
            <Divider />
            <List component="nav" aria-label="secondary mailbox folders">
                {navConfig.map((i, k) => {
                    return (
                        <ListItemLink href={i.link} key={k}>
                            <ListItemIcon className={classes.order}>{k + 1}</ListItemIcon>
                            <ListItemText primary={i.title} />
                        </ListItemLink>
                    );
                })}
            </List>
        </aside>
    );
};

export default Sidebar;
