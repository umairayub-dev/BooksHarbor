import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div
  className="rounded-3 position-relative cursor-pointer m-2"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  <Link to={`/book/${book._id}`} className="text-decoration-none">
    <img
      alt={book.title}
      src={book.coverImage}
      className="rounded-3 overflow-hidden border img-fluid"
      style={{ objectFit: "cover" }}
    />
    <div className={`overlay ${hovered ? "show" : ""}`}>
      <div className="overlay-content text-white">
        <p className="mb-0">{book.title}</p>
        <p>Price: ${book.price}</p>
      </div>
    </div>
  </Link>
</div>

  );
};

export default BookCard;
