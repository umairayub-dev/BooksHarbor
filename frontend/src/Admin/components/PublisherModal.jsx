import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const PublisherModal = ({ show, handleClose, handleSave, publisherData }) => {
  const [publisher, setPublisher] = useState({});

  const handleFieldChange = (fieldName, value) => {
    setPublisher((prevPublisher) => ({
      ...prevPublisher,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    if (publisherData) {
      setPublisher(publisherData);
    }
  }, [publisherData]);

  const handleModalSave = () => {
    handleSave(publisher, !!publisherData);
    setPublisher({});
  };

  const clearStateAndClose = () => {
    setPublisher({});
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={clearStateAndClose}
      centered
      bg="dark"
      data-bs-theme="dark"
      dialogClassName="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {publisherData ? "Edit Publisher" : "Add Publisher"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={publisher.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={publisher.location || ""}
            onChange={(e) => handleFieldChange("location", e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="foundedYear">
          <Form.Label>Founded Year</Form.Label>
          <Form.Control
            type="number"
            value={publisher.foundedYear || ""}
            onChange={(e) => handleFieldChange("foundedYear", e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="website">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            value={publisher.website || ""}
            onChange={(e) => handleFieldChange("website", e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="contactEmail">
          <Form.Label>Contact Email</Form.Label>
          <Form.Control
            type="email"
            value={publisher.contactEmail || ""}
            onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleModalSave}>
          Save Publisher
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PublisherModal;
