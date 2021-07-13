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
            ],
            [
                {
                    competitors: [
                        {
                            name: "tony"
                        },
                        {
                            name: "jonny"
                        }
                    ]
                }
            ],
            [
                {
                    competitors: [
                        {
                            name: "tony"
                        },
                        {
                            name: ""
                        }
                    ]
                }
            ]
        ]
    }

    const containerStyle = {
        display: "flex", 
        alignItems: "center",
        height: `${data.rounds[0].length * 100}px`,
    }

    return (
        <div style={containerStyle}>
            {data.rounds.map(round => <Round sets={round} />)}
        </div>
    );
}

function Round(props) {

    const containerStyle = {
        display: "flex", 
        flexDirection: "column", 
        justifyContent: 'center'
    }

    return (
        <div style={containerStyle}>
            {props.sets.map(set => <BracketSet competitors={set.competitors} />)}
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
