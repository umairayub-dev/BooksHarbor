const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../Middleware/requireAuth");

const {
  loginUser,
  signupUser,
  getProfile,
  deleteUser,
  updateUser,
  getUsers,
  updateUserRole,
  verifyToken,
} = require("./UserController");

router.post('/verify-token', verifyToken)
router.post("/login", loginUser);
router.post("/signup", signupUser);

router.get("/profile", requireAuth, getProfile);
router.get("/users", requireAuth, requireRole("admin"), getUsers);

router.patch("/profile", requireAuth, updateUser);
// Admin can change user roles ['admin', 'user']
router.patch("/update-role/:id", requireAuth,requireRole('admin'), updateUserRole);
router.delete("/user/:id", requireAuth, requireRole("admin"), deleteUser);

module.exports = router;
