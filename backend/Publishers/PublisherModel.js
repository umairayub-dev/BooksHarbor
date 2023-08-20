const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: String,
  foundedYear: Number,
  website: String,
  contactEmail: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Publisher", publisherSchema);
