import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error(
        "The provided localFilePath or originalFileName is null or undefined."
      );
    }
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
    });
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new Error(error.message || "Clodinary upload failed");
  }
};

export const deleteFromCloudinary = async (public_id) => {
  try {
    const deleteResult = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw",
    });
    return deleteResult;
  } catch (error) {
    console.error("Error while deleting from cloudinry");
  }
};
