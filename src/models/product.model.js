import mongoose, { Schema } from "mongoose";

const prodcutSchema = new Schema(
  {
    product_id: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
    product_title: {
      type: String,
      require: true,
    },
    product_img: {
      type: String,// cloudinary image 
    },
    product_discription:{
        type: String,
        require: true
    },
    product_price:{
        type: Number,
        require: true
    },
    product_category:{ //like electinic prodcut or fasion product
        type: String,
        require: true
    },
    product_brand:{
        type: String,
        require: true
    },
}
 ,
  { timestamps: true }
);

export const ProdcutSchema = mongoose.model("Product", prodcutSchema);