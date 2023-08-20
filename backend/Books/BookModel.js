// Book Model
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Date,
    default: Date.now,
  },
  edition: {
    type: Number,
  },
  pages: {
    type: Number,
  },

  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
