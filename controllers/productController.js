import fs from "fs";
import productModal from "../models/productModal.js";
import slugify from "slugify";
import categoryModal from "../models/categoryModal.js";
import orderModal from "../models/orderModal.js";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.PAYMENT_MERCHANT_ID,
  publicKey: process.env.PAYMENT_PUBLIC_KEY,
  privateKey: process.env.PAYMENT_PRIVATE_KEY,
});

export const createProduct = async (req, res) => {
  try {
    const { name, description, slug, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation

    switch (true) {
      case !name:
        return res.status(500).json({ error: "Name is required" });
      case !description:
        return res.status(500).json({ error: "Description is required" });
      case !price:
        return res.status(500).json({ error: "Price is required" });
      case !category:
        return res.status(500).json({ error: "Category is required" });
      case !quantity:
        return res.status(500).json({ error: "Quantity is required" });
      case photo && !photo.size > 1000000:
        return res
          .status(500)
          .json({ error: "Photo is required and should be less than 1 mb" });
    }
    const products = new productModal({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
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

export const getProducts = async (req, res) => {
  try {
    const products = await productModal
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All products ",
      products,
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
export const getProduct = async (req, res) => {
  try {
    const product = await productModal
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).json({
      success: true,
      product,
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
export const productPhoto = async (req, res) => {
  try {
    const product = await productModal.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModal.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: product,
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
export const updateProduct = async (req, res) => {
  try {
    const { name, description, slug, price, category, quantity, shipping } =
      req.fields;

    const { photo } = req.files;
    const { id } = req.params;

    //validation

    switch (true) {
      case !name:
        return res.status(500).json({ error: "Name is required" });
      case !description:
        return res.status(500).json({ error: "Description is required" });
      case !price:
        return res.status(500).json({ error: "Price is required" });
      case !category:
        return res.status(500).json({ error: "Category is required" });
      case !quantity:
        return res.status(500).json({ error: "Quantity is required" });
      case photo && !photo.size > 1000000:
        return res
          .status(500)
          .json({ error: "Photo is required and should be less than 1 mb" });
    }
    const product = await productModal.findByIdAndUpdate(
      id,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
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

export const getProductFilters = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModal.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};
export const getProductCount = async (req, res) => {
  try {
    const total = await productModal.find({});
    console.log("I got this fagot=>", total);
    res.status(200).send({
      success: true,
      total: total.length,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
export const getProductCountPage = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.params.page || 1;
    const products = await productModal
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};
export const getSearchedProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModal
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
export const getSimilarProducts = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModal
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while getting related product",
      error,
    });
  }
};
export const getProductByCategory = async (req, res) => {
  try {
    const category = await categoryModal.findOne({ slug: req.params.slug });
    const products = await productModal.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModal({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
