import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { Container, Row, Col, Button } from "react-bootstrap";

const Slider = () => {
  const slideData = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=898&q=80",
      title: "Discover Our Latest Collection",
      description:
        "Explore a wide range of books for every genre and interest.",
      actionLabel: "Explore Books",
      actionLink: "/books",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      title: "Browse by Categories",
      description: "Find books based on your favorite genres.",
      actionLabel: "Explore Categories",
      actionLink: "/categories",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
      title: "Explore Publishers",
      description: "Discover books from various renowned publishers.",
      actionLabel: "Browse Publishers",
      actionLink: "/publishers",
    },
  ];

  return (
    <Carousel>
      {slideData.map((slide, index) => (
        <Carousel.Item key={index}>
          <div
            className="d-block w-100"
            style={{
              maxHeight: "400px",
              objectFit: "cover",
              position: "relative",
              filter: "brightness(30%)", // Dim the image
            }}
          >
            <img
              src={slide.imageUrl}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <Carousel.Caption
            className="text-light"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <Container>
              <Row>
                <Col md={12}>
                  <h4>{slide.title}</h4>
                  <p>{slide.description}</p>
                  <Button href={slide.actionLink} variant="light">
                    {slide.actionLabel}
                  </Button>
                </Col>
              </Row>
            </Container>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Slider;
