import React, { useContext, useState } from "react";
import { CartContext } from "../Context/Cart/CartContext";
import { AuthContext } from "../Context/Auth/AuthContext";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { decodeToken } from "react-jwt";
import axios from "axios";
import useToast from "../Hooks/useToast";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { state, dispatch } = useContext(CartContext);
  const authContext = useContext(AuthContext);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    customerContact: "",
    customerCountry: "",
    customerState: "",
    customerZipCode: "",
    customerCity: "",
  });
  const showToast = useToast();
  const handleQuantityDecrease = (itemId) => {
    const itemToUpdate = state.cart.find((item) => item._id === itemId);

    if (itemToUpdate && itemToUpdate.quantity > 1) {
      const newQuantity = itemToUpdate.quantity - 1;

      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          itemId: itemId,
          newQuantity: newQuantity,
        },
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const order = {
      products: [...state.cart],
      totalAmount: calculateSubtotal(),
      user: {
        user_id: decodeToken(authContext.state.token).id,
        ...formData,
      },
    };
    try {
      await axios
        .post("/api/v1/create-order", order, {
          headers: {
            Authorization: `Bearer ${authContext.state.token}`,
          },
        })
        .then((res) => {
          // showToast("success", "Order placed successfully!", 3000);
          setShowOrderModal(true);
          dispatch({
            type: "EMPTY_CART",
          });
        })
        .catch((e) => {
          showToast(
            "error",
            "Failed to place the order. Please try again.",
            3000
          );
          console.log(e);
        });
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("error", "Failed to place the order. Please try again.", 3000);
    }
  };

  const handleQuantityIncrease = (itemId) => {
    const itemToUpdate = state.cart.find((item) => item._id === itemId);

    if (itemToUpdate) {
      const newQuantity = itemToUpdate.quantity + 1;

      dispatch({
        type: "UPDATE_QUANTITY",
        payload: {
          itemId: itemId,
          newQuantity: newQuantity,
        },
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: {
        itemId,
      },
    });
  };
  const calculateSubtotal = () => {
    return state.cart
      .reduce((subtotal, item) => subtotal + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <Container
      className="p-5 min-vh-100 min-vw-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      {" "}
      {state.cart.length > 0 ? (
        <Row className="py-4">
          <Col md={7} lg={8} className="mb-2">
            <h2>Custom Information</h2>
            <Form onSubmit={handleFormSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter address"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter country"
                      name="customerCountry"
                      value={formData.customerCountry}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter City"
                      name="customerCity"
                      value={formData.custmerCity}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter State"
                      name="customerState"
                      value={formData.customerState}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="zipCode">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter zip code"
                      name="customerZipCode"
                      value={formData.customerZipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="phone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter phone number"
                      name="customerContact"
                      value={formData.customerContact}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="paymentMethod">
                    <Form.Label>Payment Method:</Form.Label>
                    <Form.Control
                      as="select"
                      name="selectedPaymentMethod"
                      value={formData.selectedPaymentMethod}
                      onChange={handleInputChange}
                    >
                      <option value="credit-card">Credit Card</option>
                      <option value="cod">Cash on Delivery</option>
                    </Form.Control>
                  </Form.Group>

                  {formData.selectedPaymentMethod === "credit-card" && (
                    <div>
                      <Form.Group controlId="creditCardNumber">
                        <Form.Label>Credit Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter credit card number"
                          name="creditCardNumber"
                          value={formData.creditCardNumber}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="expirationDate">
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="MM/YY"
                          name="expirationDate"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="cvv">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter CVV"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </div>
                  )}
                </Col>
              </Row>
              <Button variant="primary" type="submit" className="mt-3">
                Place Order
              </Button>
            </Form>
          </Col>
          <Col md={5} lg={4}>
            <h4 class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-primary">Your cart</span>
              <span class="badge bg-primary rounded-pill">
                {state.cart.length}
              </span>
            </h4>
            {state.cart.map((item) => (
              <Card key={item.id}>
                <Card.Body>
                  <h5>{item.title}</h5>
                  <p>Price: ${item.price}</p>
                  <div>
                    <p>Quantity:</p>
                    <div className="d-flex align-items-center p-2 justify-content-between">
                      <Button
                        variant="danger"
                        onClick={() => handleQuantityDecrease(item._id)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="primary"
                        onClick={() => handleQuantityIncrease(item._id)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <p>
                    Total: ${item.price} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </Card.Footer>
              </Card>
            ))}
            <h4 className="mt-4">Subtotal: ${calculateSubtotal()}</h4>
          </Col>
        </Row>
      ) : (
        <Row className="py-4">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <Alert variant="danger text-center">
              <h3>Cart Empty</h3>
              Please add items to your cart before checking out
            </Alert>
            <Link to={"/books"}>
              <Button>Browse books</Button>
            </Link>
          </Col>
        </Row>
      )}
      <Modal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Order Placed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your order has been placed successfully!</p>
          <p>Your cart has been emptied.</p>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/books">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;
