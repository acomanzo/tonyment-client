import React, { useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { AuthContext } from '../app/App';
import { useAuth0 } from '@auth0/auth0-react';
import Tooltip from '@material-ui/core/Tooltip';

const TOURNEY_FIELDS = gql`
    fragment TourneyFields on Tourney {
        id
        name
        date
        time 
        status
        winner {
            id
            tag
        }
    }
`;

const ALL_TOURNIES = gql`
    query AllTournies {
        tourneys {
            ...TourneyFields 
        }
    }
    ${TOURNEY_FIELDS}
`;

const useStyles = makeStyles(theme => ({
    fab: {
        position: 'absolute', 
        bottom: theme.spacing(2), 
        right: theme.spacing(2)
    }
}));

export default function TourneyList(props) {

    const classes = useStyles();

    const { loading, error, data } = useQuery(ALL_TOURNIES);

    const { loginWithRedirect } = useAuth0();

    const { isAuthenticated } = useContext(AuthContext)

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error!</p>
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Winner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.tourneys?.map(tourney => (
                            <TableRow key={tourney.id}>
                                <TableCell component="th" scope="row">
                                    <Link to={`/tourney/${tourney.id}`}>
                                        {tourney.name}
                                    </Link>
                                </TableCell>
                                <TableCell align="right">{tourney.date}</TableCell>
                                <TableCell align="right">{tourney.time}</TableCell>
                                <TableCell align="right">{tourney.status}</TableCell>
                                <TableCell align="right">{tourney.winner ? tourney.winner.tag : "N/A"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isAuthenticated ? 
                <Link to={'/organize'} >
                    <Tooltip title="Create tourney" aria-label="create-tourney">
                        <Fab aria-label={'Add'} className={classes.fab} color={'primary'}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link> :
                <Tooltip title="Create tourney" aria-label="create-tourney">
                    <Fab 
                        onClick={() => loginWithRedirect({
                            redirectUri: 'http://localhost:3000/organize'
                        })} 
                        aria-label={'Add'} 
                        className={classes.fab} color={'primary'}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            }
        </>
    );
}