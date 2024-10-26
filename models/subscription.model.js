const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      // the user which subscribe the channel
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      // the user/channel which is being subscribed
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = subscription ;
