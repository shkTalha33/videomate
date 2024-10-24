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

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/update-details").post(verifyJWT, updateUserDetails);

router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover-image")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/get-current-user").post(verifyJWT, getCurrentUser);

router.route("/refresh-token").post(refreshAccessToken);

module.exports = router;
