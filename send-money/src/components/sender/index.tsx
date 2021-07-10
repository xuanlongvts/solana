import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Sender = () => {
    return (
        <Paper>
            <TextField id="amount" label="Amount (lamports)" variant="outlined" />
            <TextField id="address" label="Address" variant="outlined" />
            <Button variant="outlined" color="primary" size="large">
                Primary
            </Button>
        </Paper>
    );
};

export default Sender;
