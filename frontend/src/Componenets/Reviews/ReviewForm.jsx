import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Stars from "../Stars";

const ReviewForm = ({ onSubmit, initialReview, onCancel }) => {
  const [rating, setRating] = useState(
    initialReview ? initialReview.rating : 1
  );
  const [comment, setComment] = useState(
    initialReview ? initialReview.comment : ""
  );

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
    }
  }, [initialReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = { rating, comment };
    if (initialReview) {
      reviewData._id = initialReview._id; // Pass the review ID for update
    }
    onSubmit(reviewData);
    setRating(1);
    setComment("");
    onCancel && onCancel(); // Close the form if onCancel is provided (in edit mode)
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h3 className="fs-5 color-green fw-bold">
        {initialReview ? "Edit Your Review" : "Leave a Review"}
      </h3>
      <Form.Group controlId="formRating" className="mt-2">
        <Stars
          count={5}
          setRating={setRating}
          value={rating}
          allowUpdate={true} // Disable rating update in edit mode
          size={"lg"}
        />
      </Form.Group>

      <Form.Group controlId="formComment" className="mt-2">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter your comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>

<div className="d-flex gap-2">
      <Button className="mt-1 bg-green" variant="primary" type="submit">
        {initialReview ? "Update" : "Submit"}
      </Button>
      {initialReview && (
        <Button
          className="mt-1 ml-2 bg-red"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
</div>
    </Form>
  );
};

export default ReviewForm;
