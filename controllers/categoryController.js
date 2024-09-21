import slugify from "slugify";
import categoryModal from "../models/categoryModal.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return (
        res.status(401) /
        json({
          message: "Name is required",
        })
      );
    }
    const existingCategory = await categoryModal.findOne({ name });
    if (existingCategory) {
      return res.status(200).json({
        success: true,
        message: "Category  already exists",
      });
    }
    const category = await categoryModal.create({ name, slug: slugify(name) });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return (
        res.status(401) /
        json({
          message: "Name is required",
        })
      );
    }
    const existingCategory = await categoryModal.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    if (!existingCategory) {
      return res.status(401).json({
        success: false,
        message: "Category  does not exists",
      });
    }

    return res.status(200).json({ success: true, existingCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModal.find({});
    return res.status(200).json({
      success: true,
      message: "All categories list",
      category: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await categoryModal.findById({ slug: req.params.slug });
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryModal.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(401).json({
        success: false,
        message: "Category  does not exits",
      });
    }

    return res.status(200).json({ success: true, deletedCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};
