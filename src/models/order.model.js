import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  Customer: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  product_id: {
    // type: Schema.Types.ObjectId,
    type:String
    
  },
  num_Order: {
    type: Number,
  },
},{timestamps:true});

export const Order = mongoose.model("Order", orderSchema);
