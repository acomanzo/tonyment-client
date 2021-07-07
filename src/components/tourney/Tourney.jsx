import TourneyList from "../lists/TourneyList";
import Fab from '@material-ui/core/Fab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'absolute', 
        bottom: theme.spacing(2), 
        right: theme.spacing(2)
    }
}));

export default function Tourney(props) {

    const classes = useStyles();

    return (
        <div>
            <TourneyList />
            <Link to='/organize'>
                <Fab aria-label={'Add'} className={classes.fab} color={'primary'}>
                    <AddIcon />
                </Fab>
            </Link>
        </div>
    );
}