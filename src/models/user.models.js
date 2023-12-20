import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    FirstName: { type: String, require: true, index: true },

    LastName: { type: String, require: true },

    DOB: { type: Date, require: true },

    Gender: { type: String, require: true },

    Email: { type: String, require: true },

    Phone: { type: String, require: true, unique: true, index: true },

    Address: { type: String, require: true },

    Password: { type: String, require: true },

    RePassword: { type: String, require: true },

    Blance: { type: Number, require: true },

    previousPurchase: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    refershToken:{
      type: String,
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
