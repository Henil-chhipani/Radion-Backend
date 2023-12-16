import mongoose from "mongoose";
import { DB_Name } from "../constant.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectinstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log(`Mongodb connected DB host: ${connectinstance.connection.host}`);
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

export default connectDB;
