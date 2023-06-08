import React from "react";
import { Button, Card } from "react-bootstrap";

const Result = ({ username, tag, positives, negatives, neutrals, start_date, end_date, onDelete, onMore }) => {
  const startParts = start_date.split("-");
  const endParts = end_date.split("-");
  const formattedStartDate = startParts.reverse().join("-");
  const formattedEndDate = endParts.reverse().join("-");

  return (
    <Card className="result">
      <Card.Body>
        <Card.Title>Username: {username}</Card.Title>
        <Card.Title>Tag Searched: {tag}</Card.Title>
        <p>Number of positive words: {positives}</p>
        <p>Number of negative words: {negatives}</p>
        <p>Number of neutral words: {neutrals}</p>
        <p>Total number of tweets analyzed: {positives + negatives + neutrals}</p>
        <p>Start date: {formattedStartDate}</p>
        <p>End date: {formattedEndDate}</p>
        {' '}
        <Button variant="danger" onClick={onDelete}>Delete</Button>
        {'  '}
        <Button variant="secondary" onClick={onMore}>More data</Button>
      </Card.Body>
    </Card>
  );
}

export default Result;
