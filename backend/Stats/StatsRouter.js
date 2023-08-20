const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../Middleware/requireAuth");

const Book = require("../Books/BookModel");
const Categories = require("../Categories/CategoryModal");
const Publisher = require("../Publishers/PublisherModel");
const Users = require("../Users/UserModel");
const Orders = require("../Orders/OrderModel");
const Reviews = require("../Reviews/ReviewModel");

const getStats = async (req, res) => {
  try {
    const numBooks = await Book.countDocuments();
    const numPublishers = await Publisher.countDocuments();
    const numCategories = await Categories.countDocuments();
    const numUsers = await Users.countDocuments();
    const numReviews = await Reviews.countDocuments();
    const numOrders = await Orders.countDocuments();

    return res.status(200).json({
      numBooks,
      numCategories,
      numOrders,
      numPublishers,
      numReviews,
      numUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
router.get("/stats", requireAuth, requireRole("admin"), getStats);

module.exports = router;
