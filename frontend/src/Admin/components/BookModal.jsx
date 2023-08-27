import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { storage } from "../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useToast  from '../../Hooks/useToast'
import axios from 'axios'
const BookModal = ({ show, handleClose, handleSave, bookData }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([])
  const [publishers, setPublishers] = useState([])
  const showToast = useToast()


  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesResponse, publishersResponse] = await Promise.all([
          axios.get("https://bookharbor.cyclic.cloud/api/v1/all-categories"),
          axios.get("https://bookharbor.cyclic.cloud/api/v1/all-publishers"),
        ]);
        setCategories(categoriesResponse.data.categories);
        setPublishers(publishersResponse.data.publishers);
      } catch (error) {
        showToast('error', 'Something went wrong', 100, 1800)
        console.log(error);
      }
    }
    fetchData();

    if (bookData) {
      const formattedDate = new Date(bookData.publish_date)
        .toISOString()
        .slice(0, 10);

      setFormData({
        ...bookData,
        publish_date: formattedDate,
      });
      setSelectedImages(bookData.images || []);
    }
  }, [bookData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleImageUpload = async (e, imageField) => {
    console.log(e);
    setLoading(true);
    const imageFiles = e.target.files;

    try {
      if (!imageFiles.length) return;

      const uploadedUrls = [];

      for (const imageFile of imageFiles) {
        const storageRef = ref(
          storage,
          `images/book/${formData.ISBN}/${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(snapshot.ref);

        uploadedUrls.push(url);
      }

      if (imageField === "coverImage") {
        setFormData((prevData) => ({
          ...prevData,
          [imageField]: uploadedUrls[0],
        }));
      } else {
        setSelectedImages((prevImages) => [...prevImages, ...uploadedUrls]);
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.publisher) {
      showToast('error','Publisher or Category not set', 100,1800)
    }else {
      handleSave(
        { ...formData, images: selectedImages },
        bookData ? true : false
      );
      setFormData({});
      setSelectedImages([]);
    }
  };

  const clearStateAndClose = () => {
    setFormData({});
    setSelectedImages([]);
    handleClose();
  };

  const handleImageBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
        <Modal.Title>{bookData ? "Update Book" : "Add Book"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="coverImage" className="d-flex flex-column">
            <Form.Label>Cover Image</Form.Label>

            {loading ? (
              <Spinner />
            ) : (
              formData?.coverImage && (
                <img
                  src={formData?.coverImage}
                  alt="Cover Cover"
                  style={{ marginTop: "10px", maxWidth: "200px" }}
                />
              )
            )}
            <Form.Control
              className="mt-2"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "coverImage")}
            />
          </Form.Group>

          <Form.Group controlId="additional-images">
            <Form.Label>Selected Images</Form.Label>
            <div className="mb-2 d-flex flex-wrap">
              {selectedImages.map((imageURL, index) => (
                <div
                  key={index}
                  className="d-inline-block position-relative image-container"
                >
                  <img
                    src={imageURL}
                    alt={`Image ${index}`}
                    className="image-preview"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="remove-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    x
                  </Button>
                </div>
              ))}
              <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px dashed #ccc",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
                onClick={handleImageBoxClick}
              >
                <span style={{ fontSize: "32px" }}>+</span>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, "images")}
            />
          </Form.Group>

          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData?.title || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData?.author || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="ISBN">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="ISBN"
              value={formData?.ISBN || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                  <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.CategoryName}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control
                    as="select"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                  >
                    <option value="">Select a Publisher</option>
                    {publishers.map((publisher) => (
                      <option key={publisher._id} value={publisher.name}>
                        {publisher.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
          <Form.Group controlId="publish_date">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control
              type="date"
              name="publish_date"
              value={formData?.publish_date || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="edition">
            <Form.Label>Edition</Form.Label>
            <Form.Control
              type="number"
              name="edition"
              value={formData?.edition || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="pages">
            <Form.Label>Pages</Form.Label>
            <Form.Control
              type="number"
              name="pages"
              value={formData?.pages || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="stock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData?.stock || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData?.description || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData?.price || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {bookData ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;
