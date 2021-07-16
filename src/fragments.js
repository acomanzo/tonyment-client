import { gql } from '@apollo/client'; 

export const USER_FIELDS = gql`
    fragment UserFields on User {
        id
        tag
        sets_won {
            id
            record 
            competitors {
                id 
                tag
            }
        }
        sets_played {
            id
            status
            record
            winner {
                id
                tag
            }
            competitors {
                id
                tag
            }
            round {
                id
                bracket {
                    id 
                    tourney {
                        id
                        name
                    }
                }
            }
            created_at
        }
        brackets_won {
            id
            name
        }
        tournies_won {
            id
            name
        }
        tournies_entered {
            id
            name
        }
        tournies_organized {
            id
            name
            date
            time
            status
            bracket {
                id
                name
                isFinalized
                created_at
            }
            created_at
        }
    }
`;

export const TOURNEY_FIELDS = gql`
    fragment TourneyFields on Tourney {
        id
        name
        date
        time
        status
        bracket {
            id
            rounds {
                id
                name
                status
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
            }
            isFinalized
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