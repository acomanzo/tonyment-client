import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { gql, useQuery, useMutation } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import PlayerCard from '../user/PlayerCard';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Confirmation from './Confirmation';
import { AuthContext } from '../app/App';
import Snackbar from '@material-ui/core/Snackbar';
import { TOURNEY_FIELDS } from '../../fragments';
import TBracket from './Bracket';
import { ConfirmationContext } from './Confirmation';

const GET_TOURNEY = gql`
    query getTourney($tourney: TourneyWhere) {
        tourneys(where: $tourney) {
            ...TourneyFields
        }
    }
    ${TOURNEY_FIELDS}
`;

const TOURNEY_CONNECT_COMPETITOR = gql`
    mutation tourneyConnectCompetitor($where: TourneyWhere, $connect: TourneyConnectInput) {
        updateTourneys(where: $where, connect: $connect) {
            tourneys {
                ...TourneyFields
            }
        }
    }
    ${TOURNEY_FIELDS}
`;

const TOURNEY_DISCONNECT_COMPETITOR = gql`
    mutation tourneyDisconnectCompetitor($where: TourneyWhere, $disconnect: TourneyDisconnectInput) {
        updateTourneys(where: $where, disconnect: $disconnect) {
            tourneys {
                ...TourneyFields
            }
        }
    }
    ${TOURNEY_FIELDS}
`;

const useStyles = makeStyles({
    paper: {
        padding: '1%'
    }
});

export default function TourneyDetail(props) {

    const classes = useStyles();

    const [modal, setModal] = useState(false);

    const [snackbar, setSnackbar] = useState(false);

    const { isAuthenticated, userId } = useContext(AuthContext);

    const [connectTourney, connectedTourney] = useMutation(TOURNEY_CONNECT_COMPETITOR, {
        update(cache, {data: {updateTourneys}}) {
            const data = cache.readQuery({
                query: GET_TOURNEY,
                variables: {
                    tourney: {
                        id: props.match.params.id
                    }
                }
            });
            cache.writeQuery({
                query: GET_TOURNEY,
                variables: {
                    tourney: {
                        id: props.match.params.id
                    }
                },
                data: {tourneys: [updateTourneys.tourneys[0]]}
            });
        },
    });

    const [disconnectTourney, disconnectedTourney] = useMutation(TOURNEY_DISCONNECT_COMPETITOR, {
        update(cache, {data: {updateTourneys}}) {
            const data = cache.readQuery({
                query: GET_TOURNEY, 
                variables: {
                    tourney: {
                        id: props.match.params.id 
                    }
                }
            });
            cache.writeQuery({
                query: GET_TOURNEY, 
                variables: {
                    tourney: {
                        id: props.match.params.id 
                    }
                },
                data: {tourneys: [updateTourneys.tourneys[0]]}
            });
        },
    });

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const { loading, error, data } = useQuery(GET_TOURNEY, {
        variables: {
            tourney: {
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

    const tourney = data.tourneys[0];

    const register = e => {

        setModal(false);
        
        connectTourney({
            variables: {
                where: {
                    id: tourney.id,
                },
                connect: {
                    competitors: {
                        where: {
                            id: userId
                        }
                    }
                }
            }
        });

        setSnackbar(true);
    };

    const deregister = e => {
        
        setModal(false);

        disconnectTourney({
            variables: {
                where: {
                    id: tourney.id 
                },
                disconnect: {
                    competitors: {
                        where: {
                            id: userId
                        }
                    }
                }
            },
        });

        setSnackbar(true);
    };

    function registerButton() {

        if (tourney.status === 'NOT_STARTED') {
            if (isAuthenticated) {
                const isRegistered = tourney.competitors.find(competitor => competitor.id === userId) !== undefined;
                return (
                    <>
                        <Button onClick={openModal} variant="contained">{isRegistered ? 'Deregister' : 'Register now'}</Button>
                        <Confirmation 
                            open={modal} 
                            confirm={() => isRegistered ? deregister() : register()} 
                            onClose={closeModal} 
                            tourney={tourney} 
                            context={{registering: !isRegistered, purpose: ConfirmationContext.REGISTRATION}} 
                        />

                        <Snackbar 
                            open={snackbar} 
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            autoHideDuration={3000} 
                            onClose={() => setSnackbar(false)}
                            message={isRegistered ? "Successfully registered" : "Successfully deregistered"}
                            key={"bottom" + "right"}
                        /> 
                    </>
                );
            }

            return <Button variant="contained" disabled>Login to register</Button>
        } else {
            return <Button variant="contained" disabled>Registration closed</Button>
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <h1>{tourney.name}</h1>
                    <p>{`${tourney.date} at ${tourney.time}`}</p>
                    <p>{tourney.status}</p>
                    <p>{tourney.winner ? `1st place: ${tourney.winner.tag}` : "Winner undecided"}</p>
                    {registerButton()}                    
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <h1>Registered Users: {tourney.competitors.length > 0 ? tourney.competitors.length : 0}</h1>
                    <Grid container spacing={2}>
                        {tourney.competitors.map(competitor => (
                            <Grid item xs={2} key={competitor.id}>
                                <PlayerCard competitor={competitor} />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <TBracket tourney={tourney} />
            </Grid>
        </Grid>
    );
}