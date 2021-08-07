const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
    lastActiveAt: {type:Date},
    userStatus: {type: String, default: true},
    walletAmount: {type: Number, default: 0},
    currentSessionId: {type: String, default:"not assigned"}
     
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
