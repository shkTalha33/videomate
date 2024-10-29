const {
  publishAVideo,
  getAllVideos,
} = require("../controllers/video.controller.js");
const { verifyJWT } = require("../Middleware/auth.middleware.js");
const upload = require("../Middleware/multer.middleware.js");
const { Router } = require("express");

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/publish-video").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/get-all-videos").get(getAllVideos);

module.exports = router;
