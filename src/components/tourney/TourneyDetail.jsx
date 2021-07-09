import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import PlayerCard from '../user/PlayerCard';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Confirmation from './Confirmation';

const TOURNEY_FIELDS = gql`
    fragment TourneyFields on Tourney {
        id
        name
        date
        time
        status
        bracket {
            id
            sets {
                id
                record
                status
                winner {
                    id
                    tag
                }
                competitors {
                    id
                    tag
                }
            }
            winner {
                id
                tag
            }
        }
        winner {
            id
            tag
        }
        competitors {
            id
            tag
        }
    }
`;

const GET_TOURNEY = gql`
    query getTourney($tourney: TourneyWhere) {
        tourneys(where: $tourney) {
            ...TourneyFields
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

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const register = e => {
        setModal(false);

        // update tourney node (competitors)

        
        // update player node (tournies_entered)
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

    console.log(data.tourneys[0]);
    const tourney = data.tourneys[0];

    // const competitors = [
    //     {id: 1, tag: "tony"}, 
    //     {id: 2, tag: "matt"}, 
    //     {id: 3, tag: "mayank"},
    //     {id: 4, tag: "jonny"},
    //     {id: 5, tag: "james"},
    //     {id: 6, tag: "james"}, 
    //     {id: 7, tag: "lucas"}
    // ]

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <h1>{tourney.name}</h1>
                    <p>{`${tourney.date} at ${tourney.time}`}</p>
                    <p>{tourney.status}</p>
                    <p>{tourney.winner ? `1st place: ${tourney.winner}` : "Winner undecided"}</p>
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
            <Grid item xs>
                <Button onClick={openModal} variant="contained">Register Now</Button>
                <Confirmation open={modal} register={register} onClose={closeModal} tourney={tourney} />
            </Grid>
        </Grid>
    );
}