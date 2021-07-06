import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';

const GET_TOURNEY = gql`
    
`;

export default function TourneyDetail(props) {
    return (
        <Paper>
            <h1>{props.name}</h1>
            <p>{props.date}</p>
            <p>{props.time}</p>
            <p>{props.status}</p>
            <p>{props.winner ? props.winner : "N/A"}</p>
        </Paper>
    )
}