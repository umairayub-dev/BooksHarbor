const express = require("express");
const router = express.Router();
const { requireRole, requireAuth } = require("../Middleware/requireAuth");

const {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  getPublisherByName,
  updatePublisher,
  deletePublisher,
} = require("./PublisherController");

router.get("/all-publishers", getAllPublishers);
router.get("/publisher-by-id/:id", getPublisherById);
router.get("/publisher-by-name/:name", getPublisherByName);

// admin routes
router.post(
  "/add-publisher/",
  requireAuth,
  requireRole("admin"),
  createPublisher
);
router.put(
  "/update-publisher/:id",
  requireAuth,
  requireRole("admin"),
  updatePublisher
);
router.delete(
  "/delete-publisher/:id",
  requireAuth,
  requireRole("admin"),
  deletePublisher
);

module.exports = router;
