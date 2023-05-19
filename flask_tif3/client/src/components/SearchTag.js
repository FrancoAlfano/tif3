import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../auth';
import { useForm } from 'react-hook-form';
import PacmanLoader from 'react-spinners/PacmanLoader';
import "../styles/searchTag.css";

const LoggedInSearchTag = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loadingInProgress, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');
  const [serverResponse, setServerResponse] = useState('');

  const submitForm = (data) => {
    setLoading(true);
    const body = {
      tag: data.tag,
      username: data.username,
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(body),
    };

    fetch('/result/results', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        history.push('/');
      })
      .catch((err) => {
        setLoading(false);
        setShow(true);
        setServerResponse('Tag not found!');
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(submitForm)();
    }
  };

  return (
    <div>
      {loadingInProgress ? (
        <div className="loader-container">
          <PacmanLoader color="#1DA1F2" size={50} />
        </div>
      ) : (
        <div className="container">
          <div className="form">
            {show ? (
              <>
                <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                  <p>{serverResponse}</p>
                </Alert>
                <h1>Search Tag</h1>
              </>
            ) : (
              <h1>Search Tag</h1>
            )}
            <form>
              <Form.Group>
                <Form.Label>Insert tag: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Twitter tag #"
                  {...register('tag', { required: true, maxLength: 10 })}
                  onKeyDown={handleKeyDown}
                />
                {errors.tag && (
                  <p style={{ color: 'red' }}>
                    <small>Tag is required</small>
                  </p>
                )}
                {errors.tag?.type === 'maxLength' && (
                  <p style={{ color: 'red' }}>
                    <small>Max characters are 10</small>
                  </p>
                )}
              </Form.Group>
              <br />
              <Form.Group>
                <Button as="sub" variant="primary" onClick={handleSubmit(submitForm)}>
                  Search Tag
                </Button>
              </Form.Group>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const LoggedOutSearchTag = () => {
  return (
    <div className="home container">
      <h1 className="heading">Welcome to TwitterWatch</h1>
      <Link to="/login" className="btn btn-primary btn-lg">
        Login
      </Link>
    </div>
  );
};

const SearchTagPage = () => {
  const [logged] = useAuth();
  return <div>{logged ? <LoggedInSearchTag /> : <LoggedOutSearchTag />}</div>;
};

export default SearchTagPage;
