import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
//configure env

dotenv.config();
//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//rest apis

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
//Port
const PORT = process.env.PORT || 8080;

// run listen

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}...`);
    });
  } catch (error) {
    console.log("Error while server initiation:", error);
  }
};

start();
