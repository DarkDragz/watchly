import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection to DB is successful");
  } catch (error) {
    console.log("Error in Mongoose:", error);
  }
};
