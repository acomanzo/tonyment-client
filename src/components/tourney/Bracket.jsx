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

// seeds bracket in order registered 
function makeBracket(tourney) {
    let rounds = [];
    let sets = [];

    // round 1
    let index = 0;
    for (let i = 0; i < tourney.competitors.length; i++) {
        const competitor = { name: tourney.competitors[i].tag }
        if (i % 2 == 0) {
            sets.push({ competitors: [ competitor ] });
            index = sets.length - 1;
        } else {
            sets[index].competitors.push(competitor);
        }
    }

    rounds.push({
        name: "Round 1",
        sets: sets,
    });

    /* 
    Library has issue where it does not make well-shaped
    brackets if there is an odd number of sets in a round. 
    This will add another set if the length of this round 
    is odd and it's not the final round (final round should
    only have one set). 
    */
    if (sets.length % 2 !== 0) {
        rounds[rounds.length - 1].sets.push({
            competitors: [
                {
                    name: 'buy', 
                }, 
                {
                    name: 'buy', 
                }, 
            ] 
        });
    }
        

    // fill rest of bracket with empty sets
    let counter = rounds[0].sets.length / 2;
    let depth = 2;
    while (counter >= 1) {
        let sets = [];
        for (let i = 0; i < counter; i++) {
            sets.push({
                competitors: [ 
                    {
                        name: 'undecided',
                    },
                    {
                        name: 'undecided', 
                    },
                ]
            });
        }
        
        rounds.push({
            name: `Round ${depth}`,
            sets: sets,
        });

         
        // Add set if odd and not last round, per explanation above 
        if (sets.length % 2 !== 0 && counter > 1) {
            sets.push({
                competitors: [ 
                    {
                        name: 'buy',
                    },
                    {
                        name: 'buy', 
                    },
                ]
            });
        }

        counter /= 2;
        depth++;
    }

    let t = JSON.parse(JSON.stringify(tourney));

    for (const round of rounds) {
        t.bracket[0].rounds.push(round);
    }
    
    return adapt(t);
}

// adapter for library 
function adapt(tourney) {
    let brackets = [];
    for (const bracket of tourney.bracket) {
        let newBracket = {
            rounds: [],
        };
        for (const round of bracket.rounds) {
            let newRound = {
                title: round.name,
                seeds: [],
            };
            let counter = 1;
            for (const set of round.sets) {
                const competitor1 = set.competitors[0];
                const competitor2 = set.competitors[1] ? set.competitors[1] : { name: 'buy'};
                let newSet = {
                    id: counter, 
                    date: `Date TBD`,
                    teams: [ competitor1, competitor2 ],
                } 
                newRound.seeds.push(newSet);
                counter++;
            }
            newBracket.rounds.push(newRound);
        }
        brackets.push(newBracket);
    }

    return brackets;
}

export default function TBracket() {

    const { loading, error, data } = useQuery(ALL_TOURNIES);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error!</p>
    }

    const bracket = makeBracket(data.tourneys[0])[0];
    const rounds = bracket.rounds;

    return (
        <div>
            <Bracket rounds={rounds} />
        </div>
    );
}