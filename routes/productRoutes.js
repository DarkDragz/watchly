import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  productPhoto,
  updateProduct,
  getProductFilters,
  getProductCount,
  getProductCountPage,
  getSearchedProducts,
  getSimilarProducts,
  getProductByCategory,
  brainTreeTokenController,
  brainTreePaymentController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const productRouter = express.Router();

//routes
productRouter.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProduct
);
//routes
productRouter.put("/:id", requireSignIn, isAdmin, formidable(), updateProduct);

//get products
productRouter.get("/", getProducts);

// //single product
productRouter.get("/:slug", getProduct);

//get photo
productRouter.get("/photo/:id", productPhoto);

// //delete product
productRouter.delete("/:id", deleteProduct);

//filter product
productRouter.post("/filters", getProductFilters);
productRouter.get("/search/:keyword", getSearchedProducts);

//product count

productRouter.get("/product-count", getProductCount);
//per page
productRouter.get("/count/:page", getProductCountPage);

productRouter.get("/related-product/:pid/:cid", getSimilarProducts);

//category wise product
productRouter.get("/product-category/:slug", getProductByCategory);

//payments routes
//token
productRouter.get("/braintree/token", brainTreeTokenController);

//payments
productRouter.post(
  "/braintree/payment",
  requireSignIn,
  brainTreePaymentController
);

export default productRouter;
