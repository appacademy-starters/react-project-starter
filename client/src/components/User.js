import React, {} from 'react';
import { Link } from 'react-router-dom';

function User(props) {
    return (
        <>
            <strong>Username:</strong> {props.user.username}<br />
            <strong>Email:</strong> {props.user.email}<br />
            <Link to={{
                pathname: `/users/${props.user.id}/edit`,
                state: {
                    user: props.user
                }
            }}> Edit </Link>
            <hr />
        </>
    );
}
export default User;