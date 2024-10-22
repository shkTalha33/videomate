const { aysncHandler } = require("../utils/aysncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { User } = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ApiResponse } = require("../utils/ApiResponse");

const registerUser = aysncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  if (
    [fullName, username, email, password].some((feild) => {
      feild?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All feilds are required!");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User username or email already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log("req.files ==>", req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went while registering user");
  }

  return res.status(200).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

});

module.exports = { registerUser };
