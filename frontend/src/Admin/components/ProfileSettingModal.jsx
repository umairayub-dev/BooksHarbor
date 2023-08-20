import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { storage } from "../../utils/firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../Context/Auth/AuthContext.jsx";
const API_URL = "/api/v1/profile";

const ProfileSettingsModal = ({ show, handleClose, user }) => {
  const [userData, setUserData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const headers = {
    Authorization: `Bearer ${user?.token}`,
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(API_URL, { headers });

      if (response.status === 200) {
        const { user } = response.data;
        setUserData(user);
        setEditedUsername(user.username);
        setEditedEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsEditMode(false);
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (event) => {
    setSelectedPhoto(event.target.files[0]);
  };

  const updateProfileImage = async (url) => {
    try {
      await axios.patch(API_URL, { userImage: url }, { headers });
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const closeModal = () => {
    setIsEditMode(false);
    setSelectedPhoto(null);
    handleClose();
  };

  const saveChanges = async () => {
    setIsLoading(true);

    try {
      const profileUpdates = {
        username: editedUsername,
        email: editedEmail,
        userImage: selectedPhoto
          ? await uploadProfileImage()
          : userData.userImage,
      };

      await axios
        .patch(API_URL, profileUpdates, { headers })
        .then((response) => {
          console.log(response);
          dispatch({ type: "UPDATE_USER", payload: response.data.token });
        });
      fetchProfile();
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsLoading(false);
      setIsEditMode(false);
    }
  };
  const uploadProfileImage = async () => {
    const storageRef = ref(storage, `images/user/${selectedPhoto.name}`);
    const snapshot = await uploadBytes(storageRef, selectedPhoto);
    return getDownloadURL(snapshot.ref);
  };
  return (
    <Modal
      show={show}
      onHide={closeModal}
      centered
      bg="dark"
      data-bs-theme="dark"
      dialogClassName="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner animation="border" />
        ) : (
          <Form>
            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex flex-column">
                  <img
                    src={
                      selectedPhoto?.name
                        ? URL.createObjectURL(selectedPhoto)
                        : userData?.userImage
                    }
                    alt="Profile"
                    width={190}
                    height={190}
                    className="profile-image"
                  />
                  {isEditMode && (
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Choose an image</Form.Label>
                      <Form.Control type="file" onChange={handlePhotoChange} />
                    </Form.Group>
                  )}
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={isEditMode ? editedUsername : userData?.username}
                onChange={(e) => setEditedUsername(e.target.value)}
                disabled={!isEditMode}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={isEditMode ? editedEmail : userData?.email}
                onChange={(e) => setEditedEmail(e.target.value)}
                disabled={!isEditMode}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>
          Cancel
        </Button>
        {isEditMode ? (
          <Button variant="primary" onClick={saveChanges} disabled={isLoading}>
            Save Changes
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setIsEditMode(true)}>
            <FaEdit /> Edit Profile
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileSettingsModal;
