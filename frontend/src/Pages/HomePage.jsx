import axios from "axios";
import React, { useEffect, useState } from "react";
import BookCard from "../Componenets/Cards/BookCard";
import Footer from "../Componenets/Footer/Footer";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Slider from "../Componenets/Slider";
import FeaturesSmallColumn from "../Componenets/Features/Features";
import TestimonialCard from "../Componenets/Cards/TestimonialCard";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPublishers, setLoadingPublishers] = useState(false);
  const [loadingFeaturedBooks, setLoadingFeaturedBooks] = useState(false);
  const testimonials = [
    {
      id: 1,
      author: "John Doe",
      position: "CEO, Company A",
      text: "This store offers an amazing variety of products and the customer service is outstanding. I'm a loyal customer!",
    },
    {
      id: 2,
      author: "Jane Smith",
      position: "Designer, Company B",
      text: "I'm impressed with the quality of products and the user-friendly website. Shopping here is a breeze!",
    },
    {
      id: 3,
      author: "Mike Johnson",
      position: "Tech Enthusiast",
      text: "I love this store's attention to detail. From the website design to the product packaging, everything is top-notch.",
    },
  ];
  useEffect(() => {
    setLoadingCategories(true);
    setLoadingFeaturedBooks(true);
    axios
      .get("/api/v1/featured-books")
      .then((response) => {
        console.log(response.data);
        setFeaturedBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books products:", error);
      })
      .finally(() => {
        setLoadingFeaturedBooks(false);
      });

    axios
      .get("/api/v1/all-categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
    axios
      .get("/api/v1/all-publishers")
      .then((response) => {
        setPublishers(response.data.publishers);
      })
      .catch((error) => {
        console.error("Error fetching publishers:", error);
      })
      .finally(() => {
        setLoadingPublishers(false);
      });
  }, []);
  return (
    <div>
      <Slider />

      <section className="py-5">
  <Container className="my-5">
    <h2 className="text-center mb-4">Featured Books</h2>
    <Row className="justify-content-center">
      {loadingFeaturedBooks ? (
        <Col className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
      ) : (
        featuredBooks.map((featuredBook) => (
          <Col key={featuredBook._id} xs={6} sm={4} md={3} lg={2}>
            <div className="card-container">
              <BookCard book={featuredBook} />
            </div>
          </Col>
        ))
      )}
    </Row>
  </Container>
</section>



      <section className="py-5">
        <Container className="my-5">
          <h2 className="text-center mb-4">Categories</h2>
          <Row className="justify-content-center">
            <div className="d-flex flex-wrap p-3">
              {loadingCategories ? (
                <Col className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Col>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/books?category=${category.CategoryName}`}
                    className="m-2 p-2 border text-decoration-none"
                  >
                    {category.CategoryName}
                  </Link>
                ))
              )}
            </div>
          </Row>
        </Container>
        <Container className="my-5">
          <h2 className="text-center mb-4">Publishers</h2>
          <Row className="justify-content-center">
            <div className="d-flex flex-wrap p-3">
              {loadingPublishers ? (
                <Col className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Col>
              ) : (
                publishers.map((publisher) => (
                  <Link
                    key={publisher._id}
                    to={`/books?publisher=${publisher.name}`}
                    className="m-2 p-2 border text-decoration-none"
                  >
                    {publisher.name}
                  </Link>
                ))
              )}
            </div>
          </Row>
        </Container>
      </section>
      <section className="py-5">
        <FeaturesSmallColumn />
      </section>
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">What Our Customers Say</h2>
          <Row className="justify-content-center">
            {testimonials.map((testimonial) => (
              <Col md={4} key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
