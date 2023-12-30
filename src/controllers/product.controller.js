import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uplodOnCloudinary } from "../utils/Cloudinary.js";

const addingProduct = asyncHandler(async (req, res) => {
  // geting product data from form
  // validation - not empty
  // check if product is already exists : product tiltle and id
  //  check for product image is added or not
  // Uplod it on cloudinary
  // Create object of product and create entry in db
  // Check if product is created or not
  // return res

  const {
    product_title,
    product_discription,
    product_price,
    product_category,
    product_brand,
  } = req.body;
  //   console.log("product_title: ", product_title);

  if (
    [
      product_title,
      product_discription,
      product_price,
      product_category,
      product_brand,
    ].some((field) => field?.trim() === "")
  ) {
    throw new Apierror(400, "All fields are required");
  }
  const count = await Product.countDocuments();
  const product_id = count + 1;
  const existedProduct = await Product.findOne({
    $or: [{ product_id }, { product_title }],
  });
  if (existedProduct) {
    throw new Apierror(409, "Product is exist in database");
  }

  let ImageLocalPath;
  if (req.file && req.file.path) {
    ImageLocalPath = req.file.path;
  } else {
    // Handle the case where the file path is not defined
    // Handle the error or respond accordingly
    // For example, you might want to send a response indicating that the file path is missing
    throw new Apierror(400, "File path is missing in the request.");
  }

  if (!ImageLocalPath) {
    throw new Apierror(400, "ImageLocally file is required");
  }
  const product_img = await uplodOnCloudinary(ImageLocalPath);

  if (!product_img) {
    throw new Apierror(400, "Error uploading image to Cloudinary");
  }

  const product = await Product.create({
    product_id,
    product_title,
    product_img: product_img.url,
    product_discription,
    product_price,
    product_category,
    product_brand,
  });

  const createdProduct = await Product.findById(product._id);

  if (!createdProduct) {
    throw new Apierror(500, "Something went wrong while creating product");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdProduct, "Product added successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const prodcut = await Product.find({});
    return res.status(200).json(new ApiResponse(200, prodcut));
  } catch (error) {
    console.log("error:", error);
    throw new Apierror(400, "error in geting product");
  }
});
export { addingProduct, getProducts };
