import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user data from form
  // validation - not empty
  //check if already exist: email
  // create user object - create entry in db
  // remove password and refresh token from response
  // check user created or not
  // return res
  const { FirstName, LastName, DOB, Gender, Email, Phone, Password } = req.body;
  console.log("email:", Email);

  if (
    [FirstName, LastName, DOB, Gender, Email, Phone, Password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new Apierror(400, "all field are nessary");
  }
  const existedUser = User.findOne({
    $or: [{ Email }, { Phone }],
  });
  if (existedUser) {
    throw new Apierror(409, "User with Email and Phone number already exists");
  }
  const user = await User.create({
    FirstName,
    LastName,
    Email,
    Phone,
    Password,
  });

  const cratedUser = await User.findById(user._id).select(
    "-Password, -refershToken"
  );

  if (!cratedUser) {
    throw new Apierror(500, "Somethig went worng while registring the user");
  }
  return res.status(201).json(
    new ApiResponse(200, cratedUser,"User register Successfully")
  )
});
export { registerUser };
