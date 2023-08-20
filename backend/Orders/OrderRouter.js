const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../Middleware/requireAuth");

const {
  getOrdersByUserId,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  orders,
  trackOrder,
} = require("./OrderController");

// get all orders (admin only)
router.get("/all-orders", requireAuth, requireRole("admin"), orders);

// get users orders
router.get("/get-user-orders", requireAuth, getOrdersByUserId);
// Create a new order
router.post("/create-order", requireAuth, createOrder);

// Update order status (admin only)
router.put(
  "/update-order/:orderId",
  requireAuth,
  requireRole("admin"),
  updateOrderStatus
);

// Cancel order (user only)
router.put("/cancel-order/:orderId", requireAuth, cancelOrder);

// no auth required
router.get("/track-order/:orderId", trackOrder);

module.exports = router;
