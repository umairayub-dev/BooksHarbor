const app = require("express");
const router = app.Router();
const { requireRole, requireAuth } = require("../Middleware/requireAuth");
const {
  addCategory,
  allCategories,
  categoryByName,
  categoryById,
  deleteCategory,
  updateCategory,
} = require("./CategoryController");

router.post("/add-category", requireAuth, requireRole("admin"), addCategory);
router.get("/all-categories", allCategories);
router.get("/category-by-name/:name", categoryByName);
router.get("/category-by-id/:id", categoryById); 
router.delete(
  "/delete-category/:id",
  requireAuth,
  requireRole("admin"),
  deleteCategory
);
router.put(
  "/update-category/:id",
  requireAuth,
  requireRole("admin"),
  updateCategory
);

module.exports = router;
