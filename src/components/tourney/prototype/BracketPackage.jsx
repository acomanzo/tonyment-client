import React from 'react';
import { Bracket } from 'react-brackets';
import { gql, useQuery } from '@apollo/client';
import { TOURNEY_FIELDS } from '../../fragments';

const ALL_TOURNIES = gql`
    query AllTournies {
        tourneys {
            ...TourneyFields 
        }
    }
    ${TOURNEY_FIELDS}
`;

export default function TBracket() {

    const rounds = [
        {
            title: 'Round one',
            seeds: [
                {
                    id: 1,
                    date: new Date().toDateString(),
                    teams: [{ name: 'Team A' }, { name: 'Team B' }],
                },
                {
                    id: 2,
                    date: new Date().toDateString(),
                    teams: [{ name: 'Team C' }, { name: 'Team D' }],
                },
            ],
        },
        {
            title: 'Round two',
            seeds: [
                {
                    id: 3,
                    date: new Date().toDateString(),
                    teams: [{ name: 'Team A' }, { name: 'Team C' }],
                },
            ],
        },
    ];

    const { loading, error, data } = useQuery(ALL_TOURNIES);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error!</p>
    }

    return (
        <div>
            <Bracket rounds={rounds} />
        </div>
    );
}