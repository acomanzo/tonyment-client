import { useContext, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { gql, useQuery, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { USER_FIELDS } from '../../fragments';
import TODashboard from './TODashboard';
import { AuthContext } from '../app/App';
import { Status } from './TODashboard';
import ReportSet from './ReportSet';

const GET_USER = gql`
    query getUser($user: UserWhere) {
        users(where: $user) {
            ...UserFields
        }
    }
    ${USER_FIELDS}
`;

const UPDATE_SET = gql`
    mutation updateSet($where: TSetWhere, $update: TSetUpdateInput, $connect: TSetConnectInput) {
        updateTSets(where: $where, update: $update, connect: $connect) {
            tSets {
                id
                status
                record
                winner {
                    id
                    tag
                }
                competitors_progress_to {
                    id
                }
            }
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '0 1% 1% 1%'
    }
  }));

export default function PlayerDetail(props) {

    const [showReport, setShowReport] = useState(false);

    const handleOpenReport = () => {
        setShowReport(true);
    };

    const handleCloseReport = () => {
        setShowReport(false);
    };

    const submitReport = async (set, winnerId, wins, loses) => {

        const result = await updateSet({
            variables: {
                where: {
                    id: set.id, 
                },
                update: {
                    status: Status.FINISHED, 
                    record: `${wins}-${loses}`,
                    winner: {
                        connect: {
                            where: {
                                id: winnerId, 
                            },
                        },
                    },
                },
            },
        });

        // const setId = result.data.updateTSets.tSets[0].id;
        // const progressTo = result.data.updateTSets.tSets[0].competitors_progress_to[0].id;
        
        console.log(result);

        // updateSet({
        //     variables: {
        //         where: {
        //             id: progressTo, 
        //         },
        //         connect: {
        //             competitors: {
        //                 where: {
        //                     id: winnerId, 
        //                 },
        //             },
        //         },
        //     },
        // });

        setShowReport(false);
    };

    const classes = useStyles();

    const { userId } = useContext(AuthContext);

    const [updateSet, _] = useMutation(UPDATE_SET);

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

    let tourneys_entered = [];
    for (const tourney of user.tournies_entered) {
        tourneys_entered.push({ 
            id: tourney.id, 
            name: tourney.name, 
            sets_played: [] 
        });
    }
    for (const set of user.sets_played) {
        const id = set.round.bracket.tourney.id;
        for (let i = 0; i < tourneys_entered.length; i++) {
            if (tourneys_entered[i].id === id) {
                tourneys_entered[i].sets_played.push(set);
            }
        }
    }

    return (
        <>
            <Paper className={classes.paper}>
                <h1>{user.tag}</h1>
                <p>{user.email}</p>
                <div>
                    <h2>Tournies Entered: {user.tournies_entered.length}</h2>
                    {
                        tourneys_entered.map(tourney => (
                            <>
                                <h3>
                                    <Link to={`/tourney/${tourney.id}`}>
                                        {tourney.name}
                                    </Link>
                                </h3>
                                <ul>
                                    {tourney.sets_played.map(set => (
                                        <>
                                            <li onClick={handleOpenReport} className="set-item" >
                                                { set.status === Status.FINISHED ?
                                                    `${set.record}: ${set.competitors[0].tag} vs ${set.competitors.length > 1 ? set.competitors[1].tag : 'buy'}` 
                                                    :
                                                    `Undecided: ${set.competitors[0].tag} vs ${set.competitors.length > 1 ? set.competitors[1].tag : 'buy'}`
                                                }
                                            </li>
                                            <ReportSet open={showReport} onClose={handleCloseReport} submit={submitReport} set={set} />
                                        </>
                                    ))}
                                </ul>
                            </>
                        ))
                    }
                </div>
                <div>
                    <h3>Sets Played: {user.sets_played.length}</h3>
                    <ul>
                        {
                            user.sets_played.map(set => (
                                <li>
                                    { set.status === Status.FINISHED ?
                                        `${set.record}: ${set.competitors[0].tag} vs ${set.competitors.length > 1 ? set.competitors[1].tag : 'buy'}` 
                                        :
                                        `Undecided: ${set.competitors[0].tag} vs ${set.competitors.length > 1 ? set.competitors[1].tag : 'buy'}`
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Paper>
            {userId === user.id ? <TODashboard tournies={user.tournies_organized} /> : <></>}
        </>
    );
}