const User = require("./UserModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const {sendSignupEmail} = require("../Mailer/sendMail");

const createToken = (id, role, username, tokenVersion) => {
  return jwt.sign({ id, role, username, tokenVersion}, process.env.SECRET, {
    expiresIn: "3d",
  });
};

const verifyToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token not provided.' });
  }

  try {
    const { id, tokenVersion } = jwt.verify(token, process.env.SECRET);

    // Verify token version against the stored version in user's record
    const user = await User.findOne({ _id: id }).select("_id tokenVersion");
    if (!user || user.tokenVersion !== tokenVersion) {
      return res.status(200).json({ valid: false });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(200).json({ valid: false });
  }
}
// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Invalid credentials",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role, user.username, user.tokenVersion);

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        userImage: user.image,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
// signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(email);
  // validation
  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Bad Request, all fields are required",
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: "Email is not valid",
    });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      error: "Password not strong enough",
    });
  }
  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists) {
    return res.status(400).json({
      error: "Email already in use",
    });
  }
  if (usernameExists) {
    return res.status(400).json({
      error: "Username already in use",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id, user.role, user.username, user.tokenVersion);
    sendSignupEmail(email, username);
    return res.status(201).json({
      message: "Signed up successfully",
      token,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  const user_id = req.user._id;
  try {
    const user = await User.findById(user_id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    }
    const users = await User.find();
    res.status(200).json({ messsage: "User Deleted Successfully", users });
  } catch (error) {
    res.status(500).json({ error: error, msg: error.message });
  }
};

const updateUser = async (req, res) => {
  const { userImage, username, email } = req.body;
  const user_id = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { userImage, username, email },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = createToken(updatedUser._id, updatedUser.role, updatedUser.username, updatedUser.tokenVersion);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const {id } = req.params

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find().select("-password")
    res
      .status(200)
      .json({ message: "User updated successfully", users});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (users) {
      res.status(200).json({
        users,
      });
    } else {
      res.status(404).json({
        error: "No users found",
      });
    }
  } catch (error) {}
};

module.exports = {
  updateUserRole,
  loginUser,
  signupUser,
  getProfile,
  deleteUser,
  updateUser,
  getUsers,
  verifyToken,
};
