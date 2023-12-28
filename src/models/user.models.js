import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

    Blance: { type: Number, require: false},

    previousPurchase: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],

    refershToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if(!this.isModified("Password")) return next();

  this.Password = await bcrypt.hash(this.Password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(Password){
  return await bcrypt.compare(Password, this.Password)
}

userSchema.methods.genrateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      Email: this.Email,
      FirstName: this.FirstName,
      Phone: this.Phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.genrateRefreshToken = function () {
  return jwt.sign(
    {
      Email: this.Email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

export const User = mongoose.model("User", userSchema);
