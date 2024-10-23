const { Router } = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/user.controller.js");
const { verifyJWT } = require("../Middleware/auth.middleware.js")
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

router.route("/login").post(
  loginUser
)

//scecure route
router.route("/logout").post(
  verifyJWT,
  logoutUser
)

module.exports = router;
