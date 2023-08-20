import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/Auth/AuthContext";
import { CartContext } from "../Context/Cart/CartContext";
import useToast from "../Hooks/useToast";
import Reviews from "../Componenets/Reviews/Reviews";
import { formatDate } from "../utils/date";
import { Alert, Button, Carousel } from "react-bootstrap";
import { decodeToken } from "react-jwt";

const BookDetailsPage = () => {
  const [book, setBook] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();
  const showToast = useToast();
  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const BASE_URL = "/api/v1";

  const decodeUser = (token) => {
    if (!token) {
      return undefined;
    } else {
      const res = decodeToken(token);
      return { username: res?.username, token: res?.role };
    }
  };
  const currentUser = decodeUser(authContext.state?.token);

  const getBook = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/book_details/${id}`);
      setBook(response.data.book);
      console.log(response);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    getBook();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    try {
      cartContext.dispatch({
        type: "ADD_TO_CART",
        payload: { ...book, quantity },
      });
      showToast("success", "Added to Cart", 100, 2000);
    } catch (error) {}
  };
  return (
    <div className="min-vh-100 min-vw-100 h-100 bg-main text-white">
      <div className="container p-5">
        {error ? (
          <h1 className="text-center text-2xl text-red-400 font-bold p-3">
            {error.message}
          </h1>
        ) : (
          <>
            <div className="row justify-content-center">
              <div className="row col-md-12 justify-content-evenly">
                <div className="col-md-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-100"
                  />
                </div>
                <div className="col-md-6">
                  <h4 className="title fw-bold">{book.title}</h4>

                  <div class="mb-3">
                    <span class="h5">${book.price}</span>
                  </div>

                  {book.stock > 0 ? (
                    <span className="badge mx-1 my-2 fs-6 rounded-pill bg-green">
                      In Stock
                    </span>
                  ) : (
                    <span className="badge mx-1 my-2 fs-6 rounded-pill bg-danger">
                      Out of Stock
                    </span>
                  )}
                  <p>{book.description}</p>

                  <div class="row">
                    <dt class="col-3">Author:</dt>
                    <dd class="col-9">
                      <Link to={`/books?author=${book.author}`}>
                        {book.author}
                      </Link>
                    </dd>

                    <dt class="col-3">Publisher</dt>
                    <dd class="col-9">
                      <Link to={`/books?publisher=${book.publisher}`}>
                        {book.publisher}
                      </Link>
                    </dd>

                    <dt class="col-3">Category</dt>
                    <dd class="col-9">
                      <Link to={`/books?category=${book.category}`}>
                        {book.category}
                      </Link>
                    </dd>

                    <dt class="col-3">ISBN</dt>
                    <dd class="col-9">{book.ISBN}</dd>

                    <dt class="col-3">Pages</dt>
                    <dd class="col-9">
                      {book.pages ? book.pages : "Unavailable"}
                    </dd>

                    <dt class="col-3">Edition:</dt>
                    <dd class="col-9">{book.edition}</dd>

                    <dt class="col-3">Originally Published:</dt>
                    <dd class="col-9">{formatDate(book.publish_date)}</dd>
                  </div>
                  {currentUser?.token && currentUser.token != "admin" ? (
                    <div>
                      <hr />
                      <div class="row">
                        <div class="col-xs-6">
                          <div class="product_quantity">
                            <span>QTY: </span>
                            <div className="d-flex align-items-center text-white p-2 my-2">
                              <Button
                                variant="danger"
                                onClick={decreaseQuantity}
                              >
                                -
                              </Button>
                              <span className="mx-2">{quantity}</span>
                              <Button
                                variant="primary"
                                onClick={increaseQuantity}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={handleAddToCart}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <hr />
                      <Alert variant="info">
                        Users need to login to be able to add items to their
                        cart
                      </Alert>
                    </div>
                  )}
                </div>
              </div>

              {book.images && book.images?.length > 0 && (
                <div className="row mt-5">
                  <h4 className="fw-bold">Additional Images</h4>
                  <div className="col-md-12">
                    <Carousel>
                      {book.images?.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={image}
                            alt={`Image ${index}`}
                            className="w-100"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                </div>
              )}
              <div className="row mt-5">
                <Reviews bookID={id} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;
