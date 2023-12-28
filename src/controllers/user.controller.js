import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  //console.log("email: ", email);

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

  const user = await User.create({
    FirstName,
    LastName,
    DOB,
    Gender,
    Email,
    Phone,
    Address,
    Password,
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

export { registerUser };
