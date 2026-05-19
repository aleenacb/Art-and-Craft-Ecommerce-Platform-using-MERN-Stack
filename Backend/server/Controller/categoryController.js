const category = require('../models/categoryModel');

// ADD
const addCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    const categoryDetails = new category({ categoryName, description });
    await categoryDetails.save();

    res.status(201).json({
      message: "category added successfully",
      data: categoryDetails
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET ALL
const getCategory = async (req, res) => {
  try {
    const categories = await category.find();

    res.status(200).json({
      message: "category retrieved successfully",
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET BY ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await category.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Success", data });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE BY ID
const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCategory = await category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    res.status(200).json({
      message: "category deleted successfully",
      data: deletedCategory
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// UPDATE BY ID
const UpdateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedCategory = await category.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    res.status(200).json({
      message: "category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addCategory, getCategory, getCategoryById, deleteCategoryById, UpdateCategoryById };