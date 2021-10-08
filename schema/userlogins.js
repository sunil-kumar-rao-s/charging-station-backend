const mongoose = require("mongoose");
const { Schema } = mongoose;

const Userlogins = new Schema(
  {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true, unique: true },
    deviceType: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Userlogins", Userlogins);
