import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Button,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import BookCard from "../Componenets/Cards/BookCard";
import useToast from "../Hooks/useToast";
import MyPagination from "../Componenets/Pagination/MyPagination";

const BooksPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const showToast = useToast();
  const [error, setError] = useState(null);
  const [booksData, setBooksData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query_term") || ""
  );
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    author: searchParams.get("author") || "",
    publisher: searchParams.get("publisher") || "",
    price: searchParams.get("price") || "",
    sort_by: searchParams.get("sort_by") || "createdAt",
    order_by: searchParams.get("order_by") || "desc",
  });

  const handleClearFilters = () => {
    setFilters({
      category: "",
      author: "",
      publisher: "",
      price: "",
      sort_by: "createdAt",
      order_by: "desc",
    });
    searchTerm
      ? setSearchParams({ query_term: searchTerm })
      : setSearchParams({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();

    for (const key in filters) {
      if (filters[key]) {
        queryParams.set(key, filters[key]);
      }
    }
    setSearchParams(queryParams.toString());
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      const queryParams = new URLSearchParams(searchParams);
      queryParams.set("query_term", searchTerm);
      setSearchParams(queryParams);
    }
  };
  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const response = await axios.get(
        `/api/v1/books?${searchParams.toString()}`
      );
      setBooksData(response.data);
    } catch (error) {
      setError(error);
      showToast("error", "Something Went Wrong", 100, 2000);
    } finally {
      setLoadingBooks(false);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesResponse, publishersResponse] = await Promise.all([
          axios.get("/api/v1/all-categories"),
          axios.get("/api/v1/all-publishers"),
        ]);
        setCategories(categoriesResponse.data.categories);
        setPublishers(publishersResponse.data.publishers);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const gotoPage = (p) => {
    if (p >= 1) {
      const currentSearchParams = new URLSearchParams(searchParams);
      currentSearchParams.set("page", p);
      setSearchParams(currentSearchParams);
    }
  };
  return (
    <Container
      className="min-vh-100 min-vw-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <Row>
        <Col md={3} className="p-4 d-flex flex-column align-items-center">
          {loading ? (
            <Spinner animation="border" className="color-green" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : error ? (
            <p>Error loading filters</p>
          ) : (
            <div>
              <h4>Filters</h4>
              <Form>
                <Form.Group className="mt-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={filters.category}
                    onChange={handleInputChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.CategoryName}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control
                    as="select"
                    name="publisher"
                    value={filters.publisher}
                    onChange={handleInputChange}
                  >
                    <option value="">All Publishers</option>
                    {publishers.map((publisher) => (
                      <option key={publisher._id} value={publisher.name}>
                        {publisher.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Sort By</Form.Label>
                  <Form.Control
                    as="select"
                    name="sort_by"
                    value={filters.sort_by}
                    onChange={handleInputChange}
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="title">Title</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Control
                    as="select"
                    name="order_by"
                    value={filters.order_by}
                    onChange={handleInputChange}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </Form.Control>
                </Form.Group>
                <div className="mt-3 d-flex gap-2">
                  <Button
                    variant="primary"
                    type="button"
                    className="ms-0 bg-dark color-green border-0"
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    className="ms-0 bg-dark text-danger border-0"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </Col>

        <Col
          xs={12}
          md={9}
          className="p-4 d-flex flex-column justify-content-center align-items-center"
        >
          {loadingBooks ? (
            <Spinner animation="border" className="color-green" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : error ? (
            <p>Error loading books.</p>
          ) : (
            <div className="container-fluid">
              <Form className="px-5 mb-3" onSubmit={handleSearchFormSubmit}>
                <Form.Group controlId="searchForm" className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Search by title, author, etc."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    className="ms-0 bg-dark color-green border-0"
                  >
                    Search
                  </Button>
                </Form.Group>
              </Form>
              {booksData.books.length > 0 ? (
                <div className="d-flex flex-column align-items-center gap-5 ">
                  <Row className="justify-content-center container">
                    {booksData.books.map((book) => (
                      <Col key={book._id} xs={6} sm={4} md={4} lg={3}>
                        <div className="card-container">
                          <BookCard book={book} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <MyPagination
                    currentPage={parseInt(searchParams.get("page")) || 1}
                    gotoPage={gotoPage}
                    totalItems={booksData.totalBooksCount}
                  />
                </div>
              ) : (
                <Alert variant="danger" className="text-center">
                  Nothing found
                  <p>try adjusting the filters</p>
                  <p>
                    if that doesn't work then it means we don't have what you
                    are looking for
                  </p>
                </Alert>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BooksPage;
