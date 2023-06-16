import React from "react";
import { Button, Card } from "react-bootstrap";

const Result = ({ username, tag, positives, negatives, neutrals, start_date, end_date, max_tweets, onDelete, onMore }) => {
  const startParts = start_date.split("-");
  const endParts = end_date.split("-");
  const formattedStartDate = startParts.reverse().join("-");
  const formattedEndDate = endParts.reverse().join("-");

  return (
    <Card className="result">
      <Card.Body>
        <Card.Title>Tag Searched: {tag}</Card.Title>
        <br></br>
        <p>Positive words: {positives}</p>
        <p>Negative words: {negatives}</p>
        <p>Neutral words: {neutrals}</p>
        <p>Tweets pulled: {max_tweets}</p>
        <p>Tweets analyzed: {positives + negatives + neutrals}</p>
        <p>Start date: {formattedStartDate}</p>
        <p>End date: {formattedEndDate}</p>
        <br></br>
        {' '}
        <Button variant="secondary" onClick={onMore}>More data</Button>
        {'  '}
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </Card.Body>
    </Card>
  );
}

export default Result;
