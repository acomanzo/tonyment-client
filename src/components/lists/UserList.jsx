import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const USER_FIELDS = gql`
    fragment UserFields on User {
        id 
        tag
    }
`;

const ALL_USERS = gql`
    query AllUsers {
        users {
            ...UserFields
        }
    }
    ${USER_FIELDS}
`;

export default function UserList(props) {

    const { loading, error, data } = useQuery(ALL_USERS);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error!</p>
    }

    console.log(data);

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Tag</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.users?.map(user => (
                        <TableRow key={user.id}>
                            <TableCell component="th" scope="row">
                                <Link to={`/user/${user.id}`}>
                                    {user.tag}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

