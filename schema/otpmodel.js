const mongoose = require("mongoose");
const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    
    phone: { type: String, required: true },
    otp: {type: String, default: "not assigned"} 
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Otp", OtpSchema);
