import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uplodOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    // file is uploded success fully
    console.log("file uploded successfully on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlink(localfilePath); // remove locally stored file in serrver as uplod opration got fail
    return null;
  }
};

export { uplodOnCloudinary };
