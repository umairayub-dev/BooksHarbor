import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Auth/AuthContext";
import { Modal, Button, Form, Spinner, Container } from "react-bootstrap";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdEdit } from "react-icons/md";
import useToast from "../Hooks/useToast";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { state, dispatch } = useContext(AuthContext);
  const showToast = useToast();
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get("/api/v1/profile", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      setProfileData(response.data.user);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleSaveClick = async () => {
    try {
      if (selectedImage) {
        setUploadingImage(true);
        const imageUrl = await uploadPhoto();
        setProfileData((prevData) => ({
          ...prevData,
          userImage: imageUrl,
        }));
        setUploadingImage(false);
      }

      const response = await axios.patch(
        "/api/v1/profile",
        {
          username: profileData.username,
          email: profileData.email,
          userImage: profileData.userImage,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      setShowModal(false);
      showToast("success", "Profile updated", 100, 1800);
      // console.log(response);/
      dispatch({ type: "UPDATE_USER", payload: response.data.token});
    } catch (error) {
      console.error("Error saving profile data:", error);
      showToast("error", "Something went wrong", 100, 1800);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const uploadPhoto = async () => {
    if (!selectedImage) return;

    const storageRef = ref(storage, `images/user/${selectedImage.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, selectedImage);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  };

  return (
    <Container
      className="min-vh-100 min-vw-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <div className="row p-5">
        <div className="col-md-4">
          <div className="text-center">
            <img
              src={profileData.userImage}
              alt={`${profileData.username}'s avatar`}
              className="img-fluid rounded-circle"
              style={{ width: "150px", height: "150px" }}
            />
          </div>
        </div>
        <div className="col-md-8">
          <h2>{profileData.username}</h2>
          <p>Email: {profileData.email}</p>
          <p>Joined: {new Date(profileData.joined).toLocaleDateString()}</p>
          <Button variant="primary" onClick={handleEditClick}>
            <MdEdit /> Edit Profile
          </Button>
        </div>
      </div>
      <Modal
        centered
        bg="dark"
        data-bs-theme="dark"
        dialogClassName="custom-modal"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
              <div>
                {uploadingImage ? (
                  <Spinner
                    animation="border"
                    className="color-green"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : profileData.userImage ? (
                  <img
                    src={profileData.userImage}
                    alt={`${profileData.username}'s avatar`}
                    style={{ maxWidth: "50%", height: "auto" }}
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
