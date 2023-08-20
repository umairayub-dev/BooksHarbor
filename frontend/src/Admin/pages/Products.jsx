import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Spinner } from "react-bootstrap";
import MyPagination from "../../Componenets/Pagination/MyPagination";
import BookModal from "../components/BookModal";
import BookTable from "../components/ProductsTable";
import { useContext } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useToast from "../../Hooks/useToast";

const ProductsPage = () => {
  const { state } = useContext(AuthContext);
  const showToast = useToast();
  const [items, setItems] = useState({ totalItems: 0, books: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // Used for editing

  const BASE_URL = "/api/v1/books";

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

  const getBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(buildApiUrl(currentPage, limit));
      if (response.status === 200) {
        setItems({
          totalItems: response.data.totalBooksCount,
          books: response.data.books,
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setShowModal(false);
  };

  const handleSaveBook = async (book, isEdit) => {
    handleCloseModal();
    setIsLoading(true);
    try {
      let response;

      if (isEdit) {
        response = await axios.patch(
          `/api/v1/update-book/${book._id}`,
          {
            updatedBook: book,
          },
          headers
        );
        showToast("success", "Updated Book Successfully", 100, 1200);
      } else {
        response = await axios.post(
          "/api/v1/books/new",
          { ...book },
          headers
        );
        showToast("success", "Added Book Successfully", 100, 1200);
      }

      setItems({
        totalItems: response.data.totalBooksCount,
        books: response.data.books,
      });
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        isEdit ? "Unable to Update Book" : "Unable to Add Book",
        100,
        1800
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookDelete = async (bookId) => {
    setIsLoading(true);
    try {
      await axios
        .delete(
          `/api/v1/delete-book/${bookId}?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${state?.token}`,
            },
          }
        )
        .then((response) => {
          setItems({
            totalItems: response.data.totalBooksCount,
            books: response.data.books,
          });
          showToast("success", "Book Deleted", 100, 1800);
          setIsLoading(false);
        })
        .catch((erorr) => {
          console.log(erorr);
          setIsLoading(false);
          showToast("error", "Unable to delete Book", 100, 1800);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showToast("error", "Unable to delete Book", 100, 1800);
    }
  };
  useEffect(() => {
    getBooks();
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
        <span className="fs-4 fw-bold">Books</span>
        <button
          className="btn btn-outline-light"
          onClick={() => handleOpenModal()}
        >
          Add Book
        </button>
        <BookModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSaveBook}
          bookData={selectedBook}
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
              <BookTable
                books={items.books}
                handleEditBook={handleEditBook}
                handleDelete={handleBookDelete}
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
                gotoPage={handleGotoPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
