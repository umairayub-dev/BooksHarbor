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
    <Link to={`/book/${book._id}`} className="text-decoration-none">
      <div
        className="rounded-3 position-relative cursor-pointer "
        style={{ width: "11rem" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          alt={book.title}
          src={book.coverImage}
          className="rounded-3 overflow-hidden border"
          style={{ objectFit: "cover", width: "11rem", height: "17rem" }}
        />
        <div className={`overlay ${hovered ? "show" : ""}`}>
          <div className="overlay-content text-white">
            <p className="mb-0">{book.title}</p>
            <p>Price: ${book.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
