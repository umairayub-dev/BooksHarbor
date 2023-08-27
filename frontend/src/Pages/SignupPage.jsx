import React, { useState, useContext, useEffect } from "react";
import { Card } from "react-bootstrap";
import { AuthContext } from "../Context/Auth/AuthContext";
import { Link, redirect, useNavigate } from "react-router-dom";
import useToast from "../Hooks/useToast";
import axios from "axios";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(false);
  const signupUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios
        .post("/api/v1/signup", { username, email, password })
        .then((response) => {
          showToast("success", "Signup successful", 100, 2000);
          navigate("/login");
        })
        .catch((error) => {
          if (error.response) {
            console.error("Status Code:", error.response.status);
            console.error("Error Message:", error.response.data);

            if (error.response.status === 400) {
              showToast("error", error.response.data.error, 100, 2000);
            } else if (error.response.status === 500) {
              showToast("error", "Internal Server Error", 100, 2000);
            } else {
              showToast("error", "Unknown Error", 100, 2000);
            }
          } else if (error.request) {
            showToast("error", "Unknown error", 100, 2000);
          } else {
            showToast("error", "Something went wrong", 100, 2000);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      showToast("error", error.message, 100, 2000);
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-sm-center min-vh-100 min-vw-100 h-100 bg-main">
      <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
        <div className="text-center my-5">
          <h2 className="color-green fw-bolder fs-1">BookHarbor</h2>
        </div>
        <Card className="shadow-lg" bg="dark" data-bs-theme="dark">
          <div className="card-body p-5">
            <h1 className="fs-4 card-title fw-bold mb-4">Signup</h1>
            <form onSubmit={signupUser}>
              <div className="mb-3">
                <label className="mb-2 text-muted" htmlFor="email">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 text-muted" htmlFor="email">
                  E-Mail Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="text-muted" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-center">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    className="form-check-input"
                    required
                  />
                  <label htmlFor="remember" className="form-check-label">
                    I Agree to all the Terms
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary ms-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Signup"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer py-3 border-0">
            <div className="text-center">
              Already a Account? <Link to="/login">Login</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
