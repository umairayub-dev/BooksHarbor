const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../Middleware/requireAuth");

const {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
  getFeatBooks,
  updateBook,
} = require("./BookController");

// admin routes
router.post("/books/new", requireAuth, requireRole("admin"), addBook);
router.patch("/update-book/:id", requireAuth, requireRole("admin"), updateBook);
router.delete(
  "/delete-book/:id",
  requireAuth,
  requireRole("admin"),
  deleteBook
);

router.get("/books", getBooks);
router.get("/featured-books", getFeatBooks);
router.get("/book_details/:id", getBookById);

module.exports = router;
