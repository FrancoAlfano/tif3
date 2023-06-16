import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, logout } from "../auth";

const LoggedInLinks = (props) => {
  const location = useLocation();
  const homeLinkProps = {
    to: {
      pathname: "/",
      state: {
        username: props.username,
      },
    },
    className: "nav-link active",
  };
  const searchLinkProps = {
    to: {
      pathname: "/searchtag",
      state: {
        username: props.username,
      },
    },
    className: "nav-link active",
  };

  return (
    <>
      <li className="nav-item">
        <Link {...homeLinkProps}>Home</Link>
      </li>
      <li className="nav-item">
        <Link {...searchLinkProps}>Search a tag #</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="#" onClick={logout}>
          Log Out
        </Link>
      </li>
      <li className="nav-item ms-auto">
        <span className="nav-link active">Logged in as {props.username}</span>
      </li>
    </>
  );
};

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link active" aria-current="page" to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/signup">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link active" to="/login">
          Login
        </Link>
      </li>
    </>
  );
};

const NavBar = () => {
  const [logged] = useAuth();
  const username = useLocation().state?.username;
  const logoImage = "/images/logo.png";

  const logoLinkProps = {
    to: {
      pathname: "/results",
      state: {
        username: username,
      },
    },
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" {...logoLinkProps}>
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
