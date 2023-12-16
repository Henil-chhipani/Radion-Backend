import mongoose from "mongoose";
import { DB_Name } from "./src/constant.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectinstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log("db connected");
  } catch (error) {
    console.log("error", error);
  }
};

export default connectDB;
