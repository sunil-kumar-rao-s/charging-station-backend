const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdDate: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Notification", NotificationSchema);
