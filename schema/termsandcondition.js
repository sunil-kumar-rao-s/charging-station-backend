const mongoose = require("mongoose");
const { Schema } = mongoose;

const TermsSchema = new Schema(
  {
    version: { type: Number, required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('TermsAndCondition', TermsSchema);