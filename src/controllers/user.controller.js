import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const genrateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Apierror(
      500,
      "somthing went worng while genrating Refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { FirstName, LastName, DOB, Gender, Email, Phone, Address, Password } =
    req.body;
  console.log("email: ", req.body);

  if (
    [FirstName, LastName, DOB, Gender, Email, Phone, Address, Password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new Apierror(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ Phone }, { Email }],
  });

  if (existedUser) {
    throw new Apierror(409, "User with email or username already exists");
  }
  //console.log(req.files);
  const Blance = 0;

  const user = await User.create({
    FirstName,
    LastName,
    DOB,
    Gender,
    Email,
    Phone,
    Address,
    Password,
    Blance,
  });

  const createdUser = await User.findById(user._id).select(
    "-Password -refreshToken"
  );

  if (!createdUser) {
    throw new Apierror(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body data
  // email match
  // check pass
  // if there than login
  const { Email, Phone, Password } = req.body;
  if (!Email && !Phone) {
    throw new Apierror(400, "Email or phone num is require");
  }
  const user = await User.findOne({ $or: [{ Email }, { Phone }] });
  if (!user) {
    throw new Apierror(404, "User is not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(Password);

  if (!isPasswordValid) {
    throw new Apierror(401, "Password is not correct");
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    user._id
  );
  console.log("acc", accessToken);
  const logedInUser = await User.findById(user._id).select(
    "-Password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    path: "/",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refershToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refershToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refershToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new Apierror(401, "Unauthorized requst");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new Apierror(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refershToken) {
      throw new Apierror(401, "Refresh token is expired or used ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await genrateAccessAndRefreshToken(
      user._id
    );
    return res
      .status(200)
      .cookie("access Token", accessToken, options)
      .cookie("refresh Token", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new Apierror(401, error?.message || "Invalid refresh token");
  }
});

const takeOrder = asyncHandler(async (req, res) => {
  // check if user login or not
  // when user click on buy save user id from login user and product id ?
  // take num of items input from users
  // send this data to employee
  const Customer = await User.findById(req.user._id);
  if (!Customer) {
    throw new Apierror(404, "Cutomer not found");
  }
  const { product_id, num_Order } = req.body;
  const existingProduct = await Product.findOne({ product_id });
  if (!existingProduct) {
    throw new Apierror(404, "Product not found");
  }

  // Validate quantity

  // how to get product id in which user click for buy and ordering ?
  try {
    const order = await Order.create({
      Customer,
      product_id,
      num_Order,
    });
    res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } catch (error) {
    // Handle error, log it, and send an appropriate response
    console.error(error);
    throw new Apierror(500, "Error placing the order");
  }
});
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    throw new Apierror(404, "User not found");
  }
  try {
    return res.status(201).json(new ApiResponse(201, user, "User details"));
  } catch (error) {
    throw new Apierror(500, "Error in getting user");
  }
});
const getAllUser = asyncHandler(async (req, res) => {
  const docs = await User.find({});
  if (!docs) {
    throw new Apierror(404, "No users available");
  }
  try {
    return res.status(200).json(new ApiResponse(200, docs, "Users Details"));
  } catch (error) {
    throw new Apierror(500, "error in getting users");
  }
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  takeOrder,
  getUser,
  getAllUser,
};
