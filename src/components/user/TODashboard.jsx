import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Confirmation, { ConfirmationContext } from '../tourney/Confirmation';

const useStyles = makeStyles(() => ({
    paper: {
        padding: '1%',
    }
}));

const UPDATE_TOURNEY = gql`
    mutation updateTourney($where: TourneyWhere, $update: TourneyUpdateInput) {
        updateTourneys(where: $where, update: $update) {
            tourneys {
                id
                name
                date
                time
                status
            }
        }
    }
`;

export default function TODashboard({tournies}) {

    const classes = useStyles();

    if (tournies.length > 0) {
        return (
            <Paper className={classes.paper}>
                <h1>TO Dashboard</h1>
                {tournies.map(tourney => (
                    <TODashboardTourneyCard tourney={tourney} />
                ))}
            </Paper>
        );
    } else {
        return <></>
    }
}

function TODashboardTourneyCard({tourney}) {

    const [status, setStatus] = useState(tourney.status);

    const [saveChangesModal, setSaveChangesModal] = useState(false);
    const [finalizeBracketModal, setFinalizeBracketModal] = useState(false);

    const [updateTourney, updatedTourney] = useMutation(UPDATE_TOURNEY);

    const openModal = (setModal) => {
        setModal(true);
    };

    const closeModal = (setModal) => {
        setModal(false);
    };

    const saveChanges = () => {
        updateTourney({
            variables: {
                where: {
                    id: tourney.id,
                },
                update: {
                    status: status,
                },
            },
        });

        setSaveChangesModal(false);
    };

    const finalizeBracket = () => {
        // do mutation to seed bracket 
        

        setFinalizeBracketModal(false);
    };

    const handleChange = e => {
        setStatus(e.target.value);
    }

    const containerStyle = {
        display: "flex", 
        alignItems: "center"
    } 

    const headingStyle = {
        flexGrow: 1,
    }

    return (
        <div style={containerStyle}>
            <div style={headingStyle}>
                <Link to={`/tourney/${tourney.id}`} >
                    <h3>{tourney.name}</h3>
                </Link>
                <p>{`${tourney.date}, ${tourney.time}`}</p>
                <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select 
                        id={`${tourney.name}.status}`}
                        value={status}
                        onChange={handleChange}
                    >
                        <MenuItem value={"NOT_STARTED"}>Not started</MenuItem>
                        <MenuItem value={"REGISTRATION_CLOSED"}>Registration closed</MenuItem>
                        <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                        <MenuItem value={"FINISHED"}>Finished</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <Button onClick={() => openModal(setSaveChangesModal)}>
                    Save changes
                </Button>
                <Confirmation 
                    open={saveChangesModal} 
                    confirm={saveChanges} 
                    onClose={() => closeModal(setSaveChangesModal)} 
                    context={{purpose: ConfirmationContext.TO_SAVE_CHANGES}} 
                />
                <Button onClick={() => openModal(setFinalizeBracketModal)}>Finalize Bracket</Button>
                <Confirmation 
                    open={finalizeBracketModal} 
                    confirm={finalizeBracket} 
                    onClose={() => closeModal(setFinalizeBracketModal)} 
                    context={{purpose: ConfirmationContext.TO_FINALIZE_BRACKET}} 
                />
            </div>
        </div>
    );
}