import React, { useState } from "react";
import cx from "classnames";
import { useEffect } from "react";
const Stars = ({ value, setRating, allowUpdate, count, size }) => {
  const [hover, setHover] = useState(value);
  useEffect(() => {
    setHover(value);
  }, [value]);

  const handleStarClick = (index) => {
    if (allowUpdate) {
      setRating(index);
    }
  };

  const handleStarMouseEnter = (index) => {
    if (allowUpdate) {
      setHover(index);
    }
  };

  const handleStarMouseLeave = () => {
    if (allowUpdate) {
      setHover(value);
    }
  };

  const starStyle = {
    fontSize: size === "sm" ? "1" : size === "lg" ? "2.9rem" : "1.8rem",
  };
  return (
    <div className="star-rating">
      {[...Array(count)].map((_, index) => {
        index += 1;
        return (
          <span
            key={index}
            className={cx("p-1 cursor-pointer", {
              "star-filled": index <= (hover || value),
            })}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleStarMouseEnter(index)}
            onMouseLeave={handleStarMouseLeave}
          >
            <span className="star" style={starStyle}>
              &#9733;
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default Stars;