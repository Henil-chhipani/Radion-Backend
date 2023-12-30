import { Apierror } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
   if (!token) {
     throw new Apierror(401, "Unauthorise request");
   }
   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   const user = await User.findById(decodedToken?._id).select(
     "-Password -refreshToken"
   );
 
   if (!user) {
     throw new Apierror(401,"Invalid Access Token")
   }
 
   req.user = user;
   next()
   } catch (error) {
    throw new Apierror(401,error?.message || "invalid access token")
   }
});
