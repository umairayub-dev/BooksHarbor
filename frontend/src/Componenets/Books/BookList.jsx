import React from "react";
import { Row, Col } from "react-bootstrap"; // Import Col as well
import BookCard from "../Cards/BookCard";

const BookList = ({ books }) => {
  return (
    <Row className="justify-content-center mt-2">
      {books.map((book) => (
        <Col key={book._id} className="mb-3">
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  );
};

export default BookList;
