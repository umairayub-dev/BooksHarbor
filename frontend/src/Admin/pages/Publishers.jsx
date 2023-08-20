import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Spinner } from "react-bootstrap";
import MyPagination from "../../Componenets/Pagination/MyPagination";
import PublisherTable from "../components/PublisherTable";
import { useContext } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useToast from "../../Hooks/useToast";
import PublisherModal from "../components/PublisherModal";

const PublishersPage = () => {
  const { state } = useContext(AuthContext);
  const showToast = useToast();
  const [items, setItems] = useState({ totalItems: 0, publishers: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const BASE_URL = "/api/v1/all-publishers";

  const buildApiUrl = (page, limit) => {
    return `${BASE_URL}?page=${page || 1}&limit=${limit}`;
  };

  const rangeStart = (currentPage - 1) * limit + 1;
  const rangeEnd = Math.min(currentPage * limit, items.totalItems);

  const headers = {
    headers: {
      Authorization: `Bearer ${state?.token}`,
    },
  };

  const getPublishers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(buildApiUrl(currentPage, limit));
      if (response.status === 200) {
        setItems({
          totalItems: response.data.total,
          publishers: response.data.publishers,
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPublisher = (publisher) => {
    setSelectedPublisher(publisher);
    setShowModal(true);
  };

  const handleOpenModal = (publisher) => {
    setSelectedPublisher(publisher);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPublisher(null);
    setShowModal(false);
  };

  const handleSavePublisher = async (publisher, isEdit) => {
    handleCloseModal();
    setIsLoading(true);
    try {
      let response;

      if (isEdit) {
        response = await axios.put(
          `/api/v1/update-publisher/${publisher._id}?page=${currentPage}&limit=${limit}`,
          {
            name: publisher.name,
            location: publisher.location,
            foundedYear: publisher.foundedYear,
            website: publisher.website,
            contactEmail: publisher.contactEmail,
          },
          headers
        );
        showToast("success", "Updated Publisher Successfully", 100, 1200);
      } else {
        response = await axios.post(
          `/api/v1/add-publisher?page=${currentPage}&limit=${limit}`,
          { ...publisher },
          headers
        );
        showToast("success", "Added Publisher Successfully", 100, 1200);
      }

      setItems({
        totalItems: response.data.total,
        publishers: response.data.publishers,
      });
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        isEdit ? "Unable to Update Publisher" : "Unable to Add Publisher",
        100,
        1800
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublisherDelete = async (publisherId) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `/api/v1/delete-publisher/${publisherId}?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${state?.token}`,
          },
        }
      );
      showToast("success", "Publisher Deleted", 100, 1800);
      getPublishers();
    } catch (error) {
      console.log(error);
      showToast("error", "Unable to delete Publisher", 100, 1800);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPublishers();
  }, [currentPage, limit]);

  const handleGotoPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="min-vh-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <div className="border-start border-dark bg-primary p-3 d-flex text-white justify-content-between align-items-center">
        <span className="fs-4 fw-bold">Publishers</span>
        <button
          className="btn btn-outline-light"
          onClick={() => handleOpenModal()}
        >
          Add Publisher
        </button>
        <PublisherModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSavePublisher}
          publisherData={selectedPublisher}
        />
      </div>
      <div className="mt-3 d-flex flex-column justify-content-center align-items-center ">
        {isLoading ? (
          <Spinner animation="border" className="color-green" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <div className="container">
              <PublisherTable
                publishers={items.publishers}
                handleEditPublisher={handleEditPublisher}
                handleDelete={handlePublisherDelete}
              />
            </div>
            <div className="container d-flex flex-column justify-content-center align-items-center">
              <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                <p className="text-white mb-2 mb-md-0">
                  Showing {rangeStart} - {rangeEnd} of {items.totalItems} items
                </p>
                <Form.Select
                  className="mb-2 mb-md-0"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  style={{ width: "180px" }}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={30}>30 per page</option>
                  <option value={40}>40 per page</option>
                  <option value={50}>50 per page</option>
                </Form.Select>
              </div>
              <MyPagination
                currentPage={currentPage}
                totalItems={items.totalItems}
                limit={limit}
                gotoPage={handleGotoPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublishersPage;
