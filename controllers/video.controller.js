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
    duration: video.duration,
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

const getAllVideos = aysncHandler(async (req, res) => {
  const {
    limit = 5,
    page = 1,
    query,
    sortBy = "createdAt",
    sortType = "asc",
  } = req.query;

const aggregate = Video.aggregate([
  {
    $match: {
      isPublished: true,
      ...(query ? {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      } : {}),
    },
  },
  {
      $sort: {
          [sortBy]: sortType === "asc" ? 1 : -1, // Dynamic sorting
      },
  },
  {
    $lookup:{
      from:"users",
      localField: "owner",
      foreignField: "_id",
      as:"owner",
      pipeline:[
         {
          $project: {
            fullName: 1,
            username: 1,
            avatar: 1,
          },
         }
      ]
    }
  },
  {
    $addFields:{
      owner:{
        $first:"$owner"
      }
    }
  },
  {
    $project:{
      thumbnail:1,
      title:1,
      description:1,
      createdAt:1,
      owner:1,
      totalPages:1
    }
  }
]);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await Video.aggregatePaginate(aggregate, options);

  return res.status(200)
  .json(
    new ApiResponse(
      200,
      result.docs,
      "Videos fetched successfully!"
    )
  )
});

module.exports = { publishAVideo, getAllVideos };
