const mongoose = require("mongoose");
const { Schema } = mongoose;

const privacyPolicySchema = new Schema(
  {
    version: { type: Number, required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Privacypolicy', privacyPolicySchema);