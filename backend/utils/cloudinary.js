const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config(); // ✅ REQUIRED

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "UpNext",
    });

    fs.unlinkSync(filePath); // delete local file
    return result.secure_url;

  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};

module.exports = uploadToCloudinary;
