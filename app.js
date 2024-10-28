const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes import
const userRouter = require("./routes/user.routes.js");
const videoRouter = require("./routes/video.routes.js")

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter)

module.exports = { app };
