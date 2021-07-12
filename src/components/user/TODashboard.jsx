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

    const [updateTourney, updatedTourney] = useMutation(UPDATE_TOURNEY);

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
                <h3>{tourney.name}</h3>
                <p>{`${tourney.date}, ${tourney.time}`}</p>
                <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select 
                        id={`${tourney.name}.status}`}
                        value={status}
                        onChange={handleChange}
                    >
                        <MenuItem value={"NOT_STARTED"}>Not started</MenuItem>
                        <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                        <MenuItem value={"FINISHED"}>Finished</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <Button onClick={saveChanges}>
                    Save changes
                </Button>
            </div>
        </div>
    );
}
