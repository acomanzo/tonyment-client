import React from 'react';

export default function Bracket({bracket}) {

    const data = {
        rounds: [
            [
                {
                    competitors: [
                        {
                            name: "tony"
                        }, 
                        {
                            name: "matt"
                        }
                    ]
                },
                {
                    competitors: [
                        {
                            name: "mayank"
                        }, 
                        {
                            name: "james"
                        }
                    ]
                },
                {
                    competitors: [
                        {
                            name: "jonny"
                        }, 
                        {
                            name: "james"
                        }
                    ]
                },
                {
                    competitors: [
                        {
                            name: "caleb"
                        }, 
                        {
                            name: "lucas"
                        }
                    ]
                }
            ],
            [
                {
                    competitors: [
                        {
                            name: "tony", 
                        }, 
                        {
                            name: "mayank"
                        }
                    ]
                },
                {
                    competitors: [
                        {
                            name: "jonny", 
                        },
                        {
                            name: "lucas"
                        }
                    ]
                }
            ]
        ]
    }

    const containerStyle = {
        display: "grid",
        gridTemplateColumns: 'repeat(12, 100px)', 
        gridTemplateRows: 'repeat(12, 100px)',
        gridAutoFlow: 'column',
    }

    return (
        <div style={containerStyle}>
            {data.rounds[0].map(set => <BracketSet competitors={set.competitors} />)}
            {data.rounds[1].map(set => <BracketSet competitors={set.competitors} />)}
        </div>
    );
}

function BracketSet(props) {
    const userA = props.competitors[0];
    const userB = props.competitors[1];

    const containerStyle = {
        display: "flex",
        flexDirection: 'column',
    }

    return (
        <div style={containerStyle}>
            <BracketCell user={userA} />
            <BracketCell user={userB} />
        </div>
    );
}

function BracketCell({user}) {

    return (
        <div>
            <div>{user.name}</div>
        </div>
    );
}