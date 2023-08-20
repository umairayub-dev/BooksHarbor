import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const CategoryModal = ({ show, handleClose, handleSave, categoryData }) => {
  const [category, setCategory] = useState({});

  const handleFieldChange = (fieldName, value) => {
    setCategory((prevCategory) => ({
      ...prevCategory,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData);
    }
  }, [categoryData]);

  const handleModalSave = () => {
    handleSave(category, !!categoryData);
    setCategory({});
  };

  const clearStateAndClose = () => {
    setCategory({});
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
          {categoryData ? "Edit Category" : "Add Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="categoryName">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            value={category.CategoryName || ""}
            onChange={(e) => handleFieldChange("CategoryName", e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleModalSave}>
          Save Category
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
