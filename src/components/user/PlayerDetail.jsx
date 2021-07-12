import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { USER_FIELDS } from '../../fragments';
import TODashboard from './TODashboard';

const GET_USER = gql`
    query getUser($user: UserWhere) {
        users(where: $user) {
            ...UserFields
        }
    }
    ${USER_FIELDS}
`;

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '1%'
    }
  }));

export default function PlayerDetail(props) {

    const classes = useStyles();

    const { loading, error, data } = useQuery(GET_USER, {
        variables: {
            user: {
                id: props.match.params.id
            }
        }
    });

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error!</p>
    }

    const user = data.users[0];

    return (
        <>
            <Paper className={classes.paper}>
                <h1>{user.tag}</h1>
                <div>
                    <h3>Tournies Entered: {user.tournies_entered.length}</h3>
                    <ul>
                        {
                            user.tournies_entered.map(tourney => (
                                <li>
                                    <Link to={`/tourney/${tourney.id}`}>
                                        {tourney.name}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div>
                    <h3>Sets Played: {user.sets_played.length}</h3>
                    <ul>
                        {
                            user.sets_played.map(set => (
                                <li>{`${set.record} (${set.winner.tag}): ${set.competitors[0].tag} vs ${set.competitors[1].tag}`}</li>
                            ))
                        }
                    </ul>
                </div>
            </Paper>
            <TODashboard tournies={user.tournies_organized} />
        </>
    );
}