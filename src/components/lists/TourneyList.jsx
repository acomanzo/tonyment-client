import react from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';


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

export default function TourneyList(props) {

    const { loading, error, data } = useQuery(ALL_TOURNIES);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error!</p>
    }

    // console.log(data);

    return (
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
                                {tourney.name}
                            </TableCell>
                            <TableCell align="right">{tourney.date}</TableCell>
                            <TableCell align="right">{tourney.time}</TableCell>
                            <TableCell align="right">{tourney.status}</TableCell>
                            <TableCell align="right">{tourney.winner ? tourney.winner : "N/A"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}