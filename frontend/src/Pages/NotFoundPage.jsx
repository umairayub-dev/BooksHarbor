import { Button } from "react-bootstrap";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 min-vw-100 h-100">
      <div className="text-center text-white">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/connection-error-7621865-6167019.png"
          alt=""
        />
        <p className="lead">
          Looks like the page you’re looking for doesn’t exist.
        </p>
        <Link to="/">
          <button className="btn btn-primary color-accent">Go Back</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
