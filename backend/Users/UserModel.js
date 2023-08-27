const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DEFAULT_USER_IMAGE =
  "https://www.pngkey.com/png/full/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: DEFAULT_USER_IMAGE,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  joined: {
    type: Date,
    default: Date.now(),
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

// Middleware to increment tokenVersion on each save (e.g., when role changes)
userSchema.pre("save", function (next) {
  if (this.isModified("role") || this.isModified("password")) {
    this.tokenVersion += 1;
  }
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
