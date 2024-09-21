import express from "express";
import {
  loginController,
  registerController,
  forgotPasswordController,
  updateUserProfile,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

//router object
const authRouter = express.Router();

//Routes

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);
//forgot password
authRouter.post("/forgot-password", forgotPasswordController);

//protected routes

authRouter.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).json({ ok: true });
});
authRouter.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({ ok: true });
});

// update profile

authRouter.put("/profile", requireSignIn, updateUserProfile);

//orders
authRouter.get("/orders", requireSignIn, getOrdersController);

//all orders
authRouter.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
authRouter.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
export default authRouter;
