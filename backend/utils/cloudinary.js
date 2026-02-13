const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, mimetype = "application/octet-stream") => {
  try {
    // Determine resource type based on file type
    let resourceType = "auto";
    let uploadOptions = {
      folder: "UpNext",
      resource_type: resourceType,
      access_type: "public",  // EXPLICITLY set to public (remove token restriction)
    };
    
    if (mimetype.startsWith("image/")) {
      resourceType = "image";
      uploadOptions.resource_type = resourceType;
    } else if (mimetype.startsWith("video/")) {
      resourceType = "video";
      uploadOptions.resource_type = resourceType;
    } else {
      // PDFs, documents, and other files should use "raw"
      resourceType = "raw";
      uploadOptions.resource_type = resourceType;
    }

    console.log(`Uploading file to Cloudinary with mimetype: ${mimetype}, resource type: ${resourceType}, access: public`);
    
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Delete the temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.log(`File uploaded successfully: ${result.secure_url}`);
    console.log(`File access type: ${result.access_type}`);
    
    // Return just the secure URL string
    return result.secure_url;

  } catch (error) {
    // Clean up the temporary file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Error uploading to Cloudinary:", error.message);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

module.exports = uploadToCloudinary;
 