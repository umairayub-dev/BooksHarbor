import React from "react";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import Review from "./Review";
import { MdDelete, MdEdit } from "react-icons/md";

const ReviewList = ({ reviews, user, reviewDelete, onReviewEdit }) => {
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.username === user?.username) return -1;
    if (b.username === user?.username) return 1;
    return 0;
  });

  if (sortedReviews.length > 0) {
    return (
      <ListGroup>
        {sortedReviews.map((review) => (
          <ListGroupItem key={review.username}>
            <Review review={review} />
            {user && review.username === user.username && (
              <div className="review-edit-delete-buttons">
                <Button variant="" onClick={() => onReviewEdit(review)}>
                  <MdEdit />
                </Button>

                <Button variant="" onClick={() => reviewDelete(review._id)}>
                  <MdDelete />
                </Button>
              </div>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  } else {
    return <p>No reviews available.</p>;
  }
};

export default ReviewList;