import React from "react";
import Stars from "../Stars";
import { formatDate } from "../../utils/date";
const Review = ({ review }) => {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="font-weight-bold fs-5">{review.username}</div>
        <div className="text-muted">{formatDate(review.createdAt)}</div>
      </div>
      <div className="mr-3">
        <Stars count={5} value={review.rating} allowUpdate={false} />
      </div>
      <div className="mt-2">{review.comment}</div>
    </div>
  );
};

export default Review;
