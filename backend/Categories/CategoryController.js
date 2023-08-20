require("dotenv").config();
const Category = require("./CategoryModal");

const addCategory = async (req, res) => {
  const { CategoryName } = req.body;
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;

  if (!CategoryName) {
    res.status(403).json({
      message: "Invalid Values",
    });
  } else {
    try {
      const checkDuplicate = await Category.exists({
        CategoryName: CategoryName,
      });

      if (checkDuplicate) {
        res.json({
          message: "Category Already Exists",
        });
      } else {
        await Category.create({ CategoryName });
        const total = await Category.countDocuments();
        const categories = await Category.find()
          .skip((pageValue - 1) * limitValue)
          .limit(limitValue)
          .skip((pageValue - 1) * limitValue)
          .limit(limitValue);
        res.status(200).json({ categories, total });
      }
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
};

const allCategories = async (req, res) => {
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;
  try {
    const total = await Category.countDocuments();
    const categories = await Category.find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ categories, total });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const categoryByName = async (req, res) => {
  const { name } = req.params;

  try {
    const category = await Category.findOne({ CategoryName: name });
    res.json({
      category: category,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const categoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    res.json({
      category: category,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        error: "Category not found or already deleted",
      });
    }

    const total = await Category.countDocuments();
    const categories = await Category.find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ categories, total });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid Category id",
      });
    }

    res.status(500).json({
      error: "An error occurred while deleting the category.",
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { CategoryName } = req.body;
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;

  console.log(req.body);
  if (!CategoryName) {
    return res.status(400).json({
      error: "'CategoryName' is required for the update.",
    });
  }
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { CategoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    const total = await Category.countDocuments();
    const categories = await Category.find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ categories, total });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the category.",
    });
  }
};

module.exports = {
  addCategory,
  allCategories,
  categoryByName,
  categoryById,
  deleteCategory,
  updateCategory,
};
