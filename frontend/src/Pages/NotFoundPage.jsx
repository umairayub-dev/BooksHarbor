import { Button } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";
import not_found from '../assets/images/not_found.png';

const NotFoundPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 min-vw-100 h-100 bg-main">
      <div className="text-center text-white">
        <img
          src={not_found}
          alt="not found"
        />
        <p className="lead">
          Looks like the page you’re looking for doesn’t exist.
        </p>
        <Link to="/">
          <Button>Go Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
