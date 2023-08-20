const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user_id: {
    type:String,
    required:true,
  },
  username: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
