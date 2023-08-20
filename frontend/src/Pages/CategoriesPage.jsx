import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/all-categories")
      .then((response) => {
        setCategories(response.data.categories);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  return (
    <Container
      className="min-vh-100 min-vw-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <Row>
        <div className="p-5 text-center">
          <h2>Categories</h2>
          {loading ? (
            <Spinner animation="border" className="color-green" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : error ? (
            <Alert variant="danger">Error: {error.message}</Alert>
          ) : categories.length === 0 ? (
            <p>No categories available.</p>
          ) : (
            <div className="d-flex flex-wrap p-3">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/books?category=${category.CategoryName}`}
                  className="m-2 p-2 border text-decoration-none"
                >
                  {category.CategoryName}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Row>
    </Container>
  );
};

export default CategoriesPage;
