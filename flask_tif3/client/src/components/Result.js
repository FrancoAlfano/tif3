import React from "react";
import { Button, Card } from "react-bootstrap";

const Result=({username,tag,positives, negatives, neutrals, onClick, onDelete})=>{
    return (
        <Card className="result">
            <Card.Body>
                <Card.Title>Username: {username}</Card.Title>
                <Card.Title>Tag Searched: {tag}</Card.Title>
                <p>Number of positive words: {positives}</p>
                <p>Number of negative words: {negatives}</p>
                <p>Number of neutral words: {neutrals}</p>
                <p>Total number of tweets analyzed: {positives+negatives+neutrals}</p>
                {' '}
                <Button variant="danger" onClick={onDelete}>Delete</Button>
            </Card.Body>
        </Card>
    )
}


export default Result