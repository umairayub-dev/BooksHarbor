const express = require("express");
const router = express.Router();
const {requireAuth, requireRole} = require("../Middleware/requireAuth");

const {
  getReviews,
  createReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
  adminDeleteReview,
} = require("./ReviewController");

// admin only routes
router.get('/all-reviews', requireAuth, requireRole('admin'), getReviews)
router.delete('/delete-review/:reviewId', requireAuth, requireRole('admin'), adminDeleteReview)


router.get("/reviews/:productId", getReviewsForProduct);
router.post("/reviews/create", requireAuth, createReview);
router.put("/reviews/:reviewId", requireAuth, updateReview);
router.delete("/reviews/:reviewId", requireAuth, deleteReview);

module.exports = router;
