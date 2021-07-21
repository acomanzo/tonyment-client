import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../app/App';

const useStyles = makeStyles({
    form: {
        padding: '1%'
    }
});

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

const NEW_TOURNEY = gql`
    mutation CreateTourney($newTourney: [TourneyCreateInput!]!) {
        createTourneys(input: $newTourney) {
            tourneys {
                ...TourneyFields
            }
        }
    }
    ${TOURNEY_FIELDS}
`;

export default function Organize(props) {

    const [name, setName] = useState('');
    const [datetime, setDatetime] = useState('');

    const classes = useStyles();

    const history = useHistory();

    const { userId } = useContext(AuthContext);

    const [createTourney] = useMutation(NEW_TOURNEY, {
        update(cache, {data: {createTourneys}}) {
            const data = cache.readQuery({query: ALL_TOURNIES});
            cache.writeQuery({
                query: ALL_TOURNIES, 
                data: {tourneys: [createTourneys.tourneys[0], ...data.tourneys]}
            });
        }
    });
    
    const submit = e => {
        e.preventDefault();
        const date = datetime.substring(0, datetime.indexOf('T'));
        const time = datetime.substring(datetime.indexOf('T') + 1);
        createTourney({
            variables: {
                newTourney: {
                    name: name, 
                    date: date,
                    time: time,
                    status: "NOT_STARTED",
                    bracket: {
                        create: {
                            name: "winners", 
                            isFinalized: false,
                        },
                    },
                    organizer: {
                        connect: {
                            where: {
                                id: userId
                            }
                        }
                    }
                }
            }
        });
        history.push('/');
    }

    return (
        <Paper className={classes.form}>
            <form 
                onSubmit={submit}
                autoComplete="off"
            >
                <Grid container justifyContent="space-around">
                    <TextField 
                        label="Name" 
                        variant="filled" 
                        onChange={e => setName(e.target.value)}
                        required 
                    />
                    <TextField 
                        id="datetime"
                        label="Date"
                        type="datetime-local"
                        InputLabelProps={{
                            shrink: true 
                        }}
                        onChange={e => setDatetime(e.target.value)}
                        required
                    />
                    <Button 
                        type="submit"
                        name="submit"
                        variant="contained"
                        endIcon={<AddIcon />}
                    >Create</Button>
                </Grid>
            </form>
        </Paper>
    );
}