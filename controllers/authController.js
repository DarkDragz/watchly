import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModal from "../models/orderModal.js";
import userModals from "../models/userModals.js";
import jwt from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    //validations
    if (!name) {
      return res.json({ message: "Name is Required" });
    }
    if (!email) {
      return res.json({ message: "Email is Required" });
    }
    if (!password) {
      return res.json({ message: "Password is Required" });
    }
    if (!phone) {
      return res.json({ message: "Phone is Required" });
    }
    if (!address) {
      return res.json({ message: "Address is Required" });
    }
    if (!question) {
      return res.json({ message: "Question is Required" });
    }
    //check user
    const existingUser = await userModals.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists, please login",
      });
    }
    //register user

    const hashedPassword = await hashPassword(password);
    //save
    const user = await userModals.create({
      name,
      email,
      phone,
      address,
      question,
      password: hashedPassword,
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const user = await userModals.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is Required" });
    }
    if (!question) {
      return res.status(400).json({ message: "Password is Required" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New Password is Required" });
    }

    //check

    const user = await userModals.findOne({ email, question });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email/ Password is incorrect" });
    }
    const hashed = await hashPassword(newPassword);
    await userModals.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
    console.log(error);
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const user = await userModals.findById(req.user._id);

    //password
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 char long",
      });
    }

    const hashedPassword = password
      ? await hashPassword(password)
      : user.password;

    const updatedUser = await userModals.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
    console.log(error);
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModal
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Getting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModal
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Getting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModal.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};
