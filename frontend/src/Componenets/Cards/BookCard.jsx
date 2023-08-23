import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const [hovered, setHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsImageLoading(false);
    };
    img.src = book.coverImage;
  }, [book]);

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
      style={{ width: "100%", maxWidth: "12rem" }}
    >
      <Link to={`/book/${book._id}`} className="text-decoration-none">
        {isImageLoading ? (
          <div
            className="img-placeholder align-items-center d-flex justify-content-center"
            style={{
              width: "100%",
              height: "17rem",
              backgroundColor: "#2b2a33",
            }}
          >
            <Spinner/>
          </div>
        ) : (
          <img
            alt={book.title}
            src={book.coverImage}
            className="rounded-3 overflow-hidden border img-fluid"
            style={{ objectFit: "cover", width: "100%", height: "17rem" }}
          />
        )}
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
