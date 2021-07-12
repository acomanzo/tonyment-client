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
            record
            winner {
                id
                tag
            }
            competitors {
                id
                tag
            }
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