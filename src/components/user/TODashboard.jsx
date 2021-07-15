import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Confirmation, { ConfirmationContext } from '../tourney/Confirmation';

export const Status = {
    NOT_STARTED: "NOT_STARTED", 
    REGISTRATION_CLOSED: "REGISTRATION_CLOSED", 
    IN_PROGRESS: "IN_PROGRESS",
    FINISHED: "FINISHED"
};

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

const UPDATE_BRACKET = gql`
    mutation finalizeBracket($where: BracketWhere, $update: BracketUpdateInput) {
        updateBrackets(where: $where, update: $update) {
            brackets {
                id
            }
        }
    }
`;

const CREATE_ROUND_ONE = gql`
    mutation createRoundOne($input: [RoundCreateInput!]!) {
        createRounds(input: $input) {
            rounds {
                id
                bracket {
                    name
                    tourney {
                        id 
                        name 
                        competitors {
                            id
                        }
                    }
                }
            }
        }
    }
`;

const CREATE_SET = gql`
    mutation createSet($input: [TSetCreateInput!]!) {
        createTSets(input: $input) {
            tSets {
                id
            }
        }
    }
`;

const UPDATE_SET = gql`
    mutation updateSet($where: TSetWhere, $update: TSetUpdateInput) {
        updateTSets(where: $where, update: $update) {
            tSets {
                id
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

    const [isFinalized, setIsFinalized] = useState(tourney.bracket[0].isFinalized);

    const [saveChangesModal, setSaveChangesModal] = useState(false);
    const [finalizeBracketModal, setFinalizeBracketModal] = useState(false);

    const [updateTourney, updatedTourney] = useMutation(UPDATE_TOURNEY);

    const [updateBracket, updatedBracket] = useMutation(UPDATE_BRACKET);

    const [createRoundOne, _] = useMutation(CREATE_ROUND_ONE);

    const [createSet, __] = useMutation(CREATE_SET);

    const [updateSet, ___] = useMutation(UPDATE_SET);

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
        seedRoundOne();
        updateBracket({
            variables: {
                where: {
                    id: tourney.bracket[0].id, 
                }, 
                update: {
                    isFinalized: true, 
                }, 
            }, 
        });
        updateTourney({
            variables: {
                where: {
                    id: tourney.id, 
                }, 
                update: {
                    status: Status.REGISTRATION_CLOSED,
                },
            },
        });

        setIsFinalized(true);
        setStatus(Status.REGISTRATION_CLOSED);
        setFinalizeBracketModal(false);
    }

    const seedRoundOne = async () => {

        // make round 1
        const result = await createRoundOne({
            variables: {
                input: {
                    name: "Round 1", 
                    status: "NOT_STARTED", 
                    bracket: {
                        connect: {
                            where: {
                                name: "winners", 
                                tourney: {
                                    id: tourney.id,
                                },
                            },
                        },
                    },
                },
            },
        });

        // make sets for competitors
        const round = result.data.createRounds.rounds[0];
        const competitors = round.bracket.tourney.competitors;

        let setId = '';
        for (let j = 0; j < competitors.length; j++) {
            const competitor = competitors[j];
            if (j % 2 == 0) {
                const result = await createSet({
                    variables: {
                        input: {
                            status: "NOT_STARTED", 
                            competitors: {
                                connect: {
                                    where: {
                                        id: competitor.id, 
                                    },
                                },
                            },
                            round: {
                                connect: {
                                    where: {
                                        id: round.id, 
                                    },
                                },
                            },
                        },
                    },
                });
                setId = result.data.createTSets.tSets[0].id;
            } else {
                await updateSet({
                    variables: {
                        where: {
                            id: setId
                        },
                        update: {
                            competitors: {
                                connect: {
                                    where: {
                                        id: competitor.id, 
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
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

    const statusMenu = () => {
        if (tourney.bracket[0].isFinalized) {
            return (
                <Select 
                    id={`${tourney.name}.status}`}
                    value={status}
                    onChange={handleChange}
                >
                    <MenuItem value={Status.REGISTRATION_CLOSED}>Registration closed</MenuItem>
                    <MenuItem value={Status.IN_PROGRESS}>In progress</MenuItem>
                    <MenuItem value={Status.FINISHED}>Finished</MenuItem>
                </Select>
            );
        }

        return (
            <Select 
                id={`${tourney.name}.status}`}
                value={status}
                onChange={handleChange}
            >
                <MenuItem value={Status.NOT_STARTED}>Not started</MenuItem>
                <MenuItem value={Status.REGISTRATION_CLOSED}>Registration closed</MenuItem>
                <MenuItem value={Status.IN_PROGRESS}>In progress</MenuItem>
                <MenuItem value={Status.FINISHED}>Finished</MenuItem>
            </Select>
        );
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
                    {statusMenu()}
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
                <Button 
                    onClick={() => openModal(setFinalizeBracketModal)}
                    disabled={isFinalized}
                >
                    Finalize Bracket
                </Button>
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