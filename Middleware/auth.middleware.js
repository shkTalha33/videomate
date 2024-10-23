const jwt = require("jsonwebtoken");
const { aysncHandler } = require("../utils/aysncHandler");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/user.model");

const verifyJWT = aysncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token")
  }
});

module.exports = { verifyJWT };
