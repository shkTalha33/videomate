const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { aysncHandler } = require("../utils/aysncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const Video = require("../models/video.model.js");

const publishAVideo = aysncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;
  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "title and description are required");
  }
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video) {
    throw new ApiError(400, "Video is missing");
  }
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is missing");
  }

  const videoUpload = await Video.create({
    title,
    description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    isPublished: false,
    duration:video.duration,
    views: 0,
    owner: user._id,
  });

  if (!videoUpload) {
    throw new ApiError(500, "Something went wrong while uploading video");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, videoUpload, "Video has been uploaded successfully!")
    );
});

module.exports = { publishAVideo };
