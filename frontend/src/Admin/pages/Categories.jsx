import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Spinner } from "react-bootstrap";
import MyPagination from "../../Componenets/Pagination/MyPagination";
import CategoryTable from "../components/CategoriesTable.jsx";
import { useContext } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useToast from "../../Hooks/useToast";
import CategoryModal from "../components/CategoryModal";

const CategoriesPage = () => {
  const { state } = useContext(AuthContext);
  const showToast = useToast();
  const [items, setItems] = useState({ totalItems: 0, categories: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const BASE_URL = "/api/v1/all-categories";

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

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(buildApiUrl(currentPage, limit));
      if (response.status === 200) {
        setItems({
          totalItems: response.data.total,
          categories: response.data.categories,
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };

  const handleSaveCategory = async (category, isEdit) => {
    console.log(category);
    handleCloseModal();
    setIsLoading(true);
    try {
      let response;

      if (isEdit) {
        response = await axios.put(
          `/api/v1/update-category/${category._id}?page=${currentPage}&limit=${limit}`,
          {
            CategoryName: category.CategoryName,
          },
          headers
        );
        showToast("success", "Updated Category Successfully", 100, 1200);
      } else {
        response = await axios.post(
          `/api/v1/add-category?page=${currentPage}&limit=${limit}`,
          { ...category },
          headers
        );
        showToast("success", "Added Category Successfully", 100, 1200);
      }

      setItems({
        totalItems: response.data.total,
        categories: response.data.categories,
      });
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        isEdit ? "Unable to Update Category" : "Unable to Add Category",
        100,
        1800
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    setIsLoading(true);
    try {
      await axios
        .delete(
          `/api/v1/delete-category/${categoryId}?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${state?.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setItems({
            totalItems: response.data.total,
            categories: response.data.categories,
          });
          showToast("success", "Category Deleted", 100, 1800);
          setIsLoading(false);
        })
        .catch((erorr) => {
          console.log(erorr);
          setIsLoading(false);
          showToast("error", "Unable to delete Category", 100, 1800);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showToast("error", "Unable to delete Category", 100, 1800);
    }
  };
  useEffect(() => {
    getCategories();
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
        <span className="fs-4 fw-bold">Categoires</span>
        <button
          className="btn btn-outline-light"
          onClick={() => handleOpenModal()}
        >
          Add Category
        </button>

        <CategoryModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSaveCategory}
          categoryData={selectedCategory}
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
              <CategoryTable
                categories={items.categories}
                handleEditCategory={handleEditCategory}
                handleDelete={handleCategoryDelete}
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
                  <option value={5}>5 per page</option>
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

export default CategoriesPage;
