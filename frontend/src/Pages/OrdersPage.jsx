import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Container, Spinner, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/Auth/AuthContext";

const OrdersPage = () => {
  const { state } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "/api/v1/get-user-orders",
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [state.token]);

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      await axios.put(
        `/api/v1/cancel-order/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      setLoading(false);
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      setLoading(false);
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your order is pending processing.";
      case "Shipped":
        return "Your order has been shipped and is on its way.";
      case "Delivered":
        return "Your order has been delivered. Enjoy your products!";
      case "Canceled":
        return "Your order has been canceled.";
      default:
        return "Your order is in an unknown status.";
    }
  };

  const renderCard = (order) => (
    <Card key={order._id} className="mt-2">
  <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
    <div>
      <Card.Title>Order ID: {order._id}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        Customer: {order.user.customerName}
      </Card.Subtitle>
      <Card.Text>Total: ${order.totalAmount}</Card.Text>
      <Card.Text>Status: {order.status}</Card.Text>
      <Card.Text>{getStatusMessage(order.status)}</Card.Text>

      <div>
        <h6>Products:</h6>
        <ul>
          {order.products.map((product) => (
            <li key={product._id}>
              {product.title} - Quantity: {product.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="d-flex gap-2 mt-3 mt-md-0">
      <Link to={`/track_order?orderId=${order._id}`}>
        <Button variant="info">Track Order</Button>
      </Link>
      {order.status !== "Delivered" && order.status !== "Canceled" && (
        <Button variant="danger" onClick={() => cancelOrder(order._id)}>
          Cancel
        </Button>
      )}
    </div>
  </Card.Body>
</Card>

  );

  return (
    <Container
      className="p-5 min-vh-100 min-vw-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <h1>My Orders ({orders.length})</h1>
      <Tabs defaultActiveKey="pending" id="orders-tabs">
        <Tab eventKey="pending" title="Pending">
          {orders.filter((order) => order.status === "Pending").map(renderCard)}
          {orders.filter((order) => order.status === "Pending").length ===
            0 && <p>No pending orders to display.</p>}
        </Tab>
        <Tab eventKey="shipped" title="Shipped">
          {orders.filter((order) => order.status === "Shipped").map(renderCard)}
          {orders.filter((order) => order.status === "Shipped").length ===
            0 && <p>No shipped orders to display.</p>}
        </Tab>
        <Tab eventKey="delivered" title="Delivered">
          {orders
            .filter((order) => order.status === "Delivered")
            .map(renderCard)}
          {orders.filter((order) => order.status === "Delivered").length ===
            0 && <p>No delivered orders to display.</p>}
        </Tab>
        <Tab eventKey="canceled" title="Canceled">
          {orders
            .filter((order) => order.status === "Canceled")
            .map(renderCard)}
          {orders.filter((order) => order.status === "Canceled").length ===
            0 && <p>No canceled orders to display.</p>}
        </Tab>
      </Tabs>
      {orders.length === 0 && !loading && <p>No orders to display.</p>}
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </Container>
  );
};

export default OrdersPage;
