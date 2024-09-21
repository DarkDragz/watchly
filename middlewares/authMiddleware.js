import jwt from "jsonwebtoken";
import userModals from "../models/userModals.js";
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// admin access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModals.findById(req.user._id);
    if (!user.role) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized",
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
