const mongoose = require("mongoose");
const { Schema } = mongoose;

const Userlogins = new Schema(
  {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceType: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Userlogins", Userlogins);
