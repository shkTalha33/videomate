const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
} = require("../controllers/user.controller.js");
const { verifyJWT } = require("../Middleware/auth.middleware.js");
const upload = require("../Middleware/multer.middleware.js");

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secure route
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

router.route("/update-details").patch(verifyJWT, updateUserDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

  router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/channel-profile/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watch-history").get(verifyJWT, getWatchHistory);

module.exports = router;
