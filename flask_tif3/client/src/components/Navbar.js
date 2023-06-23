import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, logout } from "../auth";

const LoggedInLinks = (props) => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/searchtag">Search a tag #</Link>
      </li>
      <li className="nav-item ms-auto">
        <span className="nav-link active">Logged in as {props.username}</span>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="#" onClick={logout}>Log Out</Link>
      </li>
    </>
  );
};

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/signup">Sign Up</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/login">Login</Link>
      </li>
    </>
  );
};

const NavBar = () => {
  const [logged] = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (location.state?.username) {
      setUsername(location.state.username);
      localStorage.setItem('username', location.state.username);
    } else if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [location.state]);

  const logoImage = "/images/logo.png";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logoImage} alt="TwitterWatch Logo" className="navbar-image" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {logged ? <LoggedInLinks username={username} /> : <LoggedOutLinks />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
