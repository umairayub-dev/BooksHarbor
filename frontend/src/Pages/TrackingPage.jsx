import React, { useState, useEffect } from "react";
import {
  Container,
  Badge,
  Form,
  Button,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const OrderTrackingPage = () => {
  const [order, setOrder] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderData = () => {
    setLoading(true);
    setError(null);

    axios
      .get(`/api/v1/track-order/${orderId}`)
      .then((response) => {
        setOrder(response.data.order);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setOrder(null);
    fetchOrderData();
  }, [searchParams]);

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();

    if (orderId) {
      const queryParams = new URLSearchParams(searchParams);
      queryParams.set("orderId", orderId);
      setSearchParams(queryParams);
    }
  };

  return (
    <Container
      className="min-vh-100 min-vw-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <Row className="p-4 d-flex flex-column justify-content-center align-items-center">
        <div className="my-4 d-flex flex-row justify-content-center align-items-center text-center">
        <h1 className="text-ceneter fw-bolder">Order Tracking</h1>
        </div>

        <Form className="px-5 py-4 mb-3" onSubmit={handleSearchFormSubmit}>
          <Form.Group controlId="searchForm" className="input-group">
            <Form.Control
              type="text"
              placeholder="Enter Order id."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
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

        {loading && <Spinner animation="border" variant="primary" />}
        {error && (
          <Alert variant="danger">
            {error.response && error.response.data
              ? error.response.data.message
              : "An error occurred. Please try again later."}
          </Alert>
        )}

        {order && (
          <div className="timeline">
            <h5>Order Timeline</h5>
            <ul className="timeline-list p-4">
              {order.tracking.statusUpdates.map((update) => (
                <li key={update.timestamp} className="timeline-item p-3">
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <p>Date: {new Date(update.timestamp).toLocaleString()}</p>
                    <p>
                      Status:
                      <Badge
                        variant={
                          update.status === "Delivered" ? "success" : "primary"
                        }
                      >
                        {update.status}
                      </Badge>
                    </p>
                    <p>Location: {update.location}</p>
                    <p>Notes: {update.notes}</p>
                    <p>Estimated Delivery: {update.estimatedDeliveryTime}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default OrderTrackingPage;
