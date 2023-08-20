const mongoose = require("mongoose");
const reviewModel = require("./ReviewModel");

const getReviews = async (req, res) => {
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;
  try {
    const total = await reviewModel.countDocuments();
    const reviews = await reviewModel
      .find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ reviews, total });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
const adminDeleteReview = async (req, res) => {
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;
  const { reviewId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(404).json({ error: "No such review" });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    const total = await reviewModel.countDocuments();
    const reviews = await reviewModel
      .find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ reviews, total });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
const getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  const { productId, rating, comment, username } = req.body;
  const user_id = req.user._id;

  try {
    if (!productId || !rating || !comment || !username) {
      return res
        .status(400)
        .json({ message: "Invalid data. Missing required fields." });
    }
    const existingReview = await reviewModel.findOne({ user_id, productId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already left a review for this product" });
    }

    await reviewModel.create({
      user_id,
      username,
      productId,
      rating,
      comment,
    });
    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 });

    res.status(201).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(404).json({ error: "No such review" });
    }

    const review = await reviewModel.findById({ _id: reviewId });

    if (review.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized - cannot delete review" });
    }
    if (!review) {
      return res.status(404).json({ error: "No such review" });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    const { productId } = review;
    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res.status(400).json({ message: "fields missing" });
    const updatedReview = await reviewModel.findById(reviewId);

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner of the review
    if (updatedReview.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized - Cannot update review" });
    }

    // Update the review
    updatedReview.rating = rating;
    updatedReview.comment = comment;
    await updatedReview.save();

    const productId = updatedReview.productId;
    const reviews = await reviewModel.find({ productId });
    res.status(200).json({ message: "Review updated successfully", reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update the review", error: error.message });
  }
};
module.exports = {
  adminDeleteReview,
  getReviews,
  createReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
};
