const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // resource_type could be video,image etc...
    });
    //File has been uploaded
    console.log("File is upload on cloudinary!!!", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove local saved temporary file when upload operation failed
    return null;
  }
};

module.exports = { uploadOnCloudinary };
