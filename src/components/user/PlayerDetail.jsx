import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';

const USER_FIELDS = gql`
    fragment UserFields on User {
        id
        tag
        tournies_won {
            id
            name
        }
        tournies_participated {
            id
            name
        }
        sets {
            id
            record
            competitors {
                id
                tag
            }
            winner {
                id
                tag
            }
        }
    }
`;

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

    console.log(data);
    console.log(props.match.params.id);
    const user = data.users[0];

    return (
        <Paper className={classes.paper}>
            <h1>{user.tag}</h1>
            <div>
                <h3>Tournies</h3>
                <ul>
                    {
                        user.tournies_participated.map(tourney => (
                            <li>{tourney.name}</li>
                        ))
                    }
                </ul>
            </div>
            <div>
                <h3>Sets</h3>
                <ul>
                    {
                        user.sets.map(set => (
                            <li>{`${set.record} (${set.winner.tag}): ${set.competitors[0].tag} vs ${set.competitors[1].tag}`}</li>
                        ))
                    }
                </ul>
            </div>
        </Paper>
    );
}