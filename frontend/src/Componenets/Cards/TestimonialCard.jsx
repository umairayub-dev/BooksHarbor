import React from "react";
import { Card } from "react-bootstrap";

const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="testimonial-card p-3">
      <Card.Body>
        <p className="mb-0">{testimonial.text}</p>
      </Card.Body>
      <Card.Footer>
        <div className="d-flex align-items-center">
          <div className="ml-3">
            <h6 className="mb-0">{testimonial.author}</h6>
            <p className="text-muted">{testimonial.position}</p>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TestimonialCard;
