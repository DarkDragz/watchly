import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

//routes

categoryRouter.post("/create-category", requireSignIn, isAdmin, createCategory);

categoryRouter.put("/:id", requireSignIn, isAdmin, updateCategory);
categoryRouter.get("/:slug", requireSignIn, getCategory);
categoryRouter.delete("/:id", requireSignIn, isAdmin, deleteCategory);

//get all categories
categoryRouter.get("/", requireSignIn, getAllCategories);

export default categoryRouter;
