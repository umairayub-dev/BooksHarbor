import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaBolt, FaLock, FaThumbsUp } from "react-icons/fa";

export default function FeaturesSmallColumn({
  features = [
    {
      icon: <FaBolt />,
      title: "Quick delivery",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae libero et est blandit convallis quis quis purus. Vivamus non ipsum in eros vulputate ullamcorper",
    },
    {
      icon: <FaLock />,
      title: "Secure payment",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae libero et est blandit convallis quis quis purus. Vivamus non ipsum in eros vulputate ullamcorper",
    },
    {
      icon: <FaThumbsUp />,
      title: "Quality guaranteed",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae libero et est blandit convallis quis quis purus. Vivamus non ipsum in eros vulputate ullamcorper",
    },
  ],
}) {
  return (
    <Container className="text-center">          
      <h2>Features</h2>
      <Row xs={1} md={3} className="g-4 mt-2">
        {features.map((feature) => (
          <Col key={feature.title}>
            <Feature
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function Feature({ title, description, icon }) {
  return (
    <div className="d-flex flex-column align-items-center">
      <div>{icon}</div>
      <h6 className="fw-bold">{title}</h6>
      <p className="text-center">{description}</p>
    </div>
  );
}
