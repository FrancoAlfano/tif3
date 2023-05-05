import React from "react";
import { Button, Card } from "react-bootstrap";

const User=({username,email,full_name, onClick, onDelete})=>{
    return (
        <Card className="user">
            <Card.Body>
                <Card.Title>Username: {username}</Card.Title>
                <p>Email: {email}</p>
                <p>Full Name: {full_name}</p>
                <Button variant="primary" onClick={onClick}>Update</Button>
                {' '}
                <Button variant="danger" onClick={onDelete}>Delete</Button>
            </Card.Body>
        </Card>
    )
}


export default User