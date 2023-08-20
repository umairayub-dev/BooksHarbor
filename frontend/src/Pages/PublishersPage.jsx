import axios from "axios";
import React, { useState, useEffect } from "react";
import { Alert, Card, Container, Row, Spinner } from "react-bootstrap";

const PublishersPage = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/all-publishers")
      .then((response) => {
        setPublishers(response.data.publishers);
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
          <h2>Publishers</h2>
          {loading ? (
            <Spinner animation="border" className="color-green" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : error ? (
            <Alert variant="danger">Error: {error.message}</Alert>
          ) : publishers.length === 0 ? (
            <p>No publishers available.</p>
          ) : (
            <div className="d-flex flex-wrap p-3 justify-content-center gap-2">
              {publishers.map((publisher) => (
                <Card key={publisher.id}>
                  <Card.Body>
                    <Card.Title>{publisher.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {publisher.location}
                    </Card.Subtitle>
                    <Card.Text>Founded in {publisher.foundedYear}</Card.Text>
                    <Card.Link href={publisher.website} target="_blank">
                      Website
                    </Card.Link>
                    <Card.Link href={`mailto:${publisher.contactEmail}`}>
                      Contact
                    </Card.Link>
                    <Card.Link href={`/books?publisher=${publisher.name}`}>
                      Browse books
                    </Card.Link>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Row>
    </Container>
  );
};

export default PublishersPage;
