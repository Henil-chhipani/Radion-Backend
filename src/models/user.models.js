import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    FirstName: { type: String, require: true },
    LastName: { type: String, require: true },
    DOB: { type: Date, require: true },
    Gender: { type: String, require: true },
    Email: { type: String, require: true },
    Phone: { type: String, require: true, unique:false },
    Address: { type: String, require: true },
    Password: { type: String, require: true },
    RePassword: { type: String, require: true },
    Blance: { type: Number, require: true },
  },
  { timestamps: true }
);

export  const User = mongoose.model("User", userSchema);

