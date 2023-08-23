import React, { useState, useContext } from "react";
import { Badge, Button, Col, Offcanvas, Row } from "react-bootstrap";
import { CartContext } from "../../Context/Cart/CartContext";
import { FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartItemList = () => {
  const { state, dispatch } = useContext(CartContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((prevShow) => !prevShow);

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
  return (
    <div>
      <Button
        variant="primary"
        onClick={toggleShow}
        className="mx-2 position-relative"
      >
        <FaShoppingBag size={22} />
        {state.cart.length > 0 && (
          <Badge
            bg="light"
            className="position-absolute top-0 start-100 text-black translate-middle badge rounded-pill"
          >
            {state.cart.length}
          </Badge>
        )}
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {state.cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="list-group">
              {state.cart.map((item, index) => (
                <li key={index} className="list-group-item">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      width={65}
                      className="cart-item-image me-3"
                    />
                    <div>
                      <h6 className="mb-0 mt-3">{item.title}</h6>
                      <p className="text-muted">
                        ${item.price} x {item.quantity} = $
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p>Quantity:</p>
                      <div className="d-flex align-items-center p-2 my-2 justify-content-between">
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
                    </div>
                  </div>
                  <Button
                    className=""
                    variant="outline-danger"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove Item
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Row className="mt-3">
            <Col>
              <Link to="/checkout">
                <Button
                  variant="success"
                  className="w-100"
                  onClick={() => handleClose()}
                  disabled={state.cart.length < 1}
                >
                  Place Order
                </Button>
              </Link>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CartItemList;
