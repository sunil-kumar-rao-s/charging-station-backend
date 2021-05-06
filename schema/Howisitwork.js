const mongoose = require("mongoose");
const { Schema } = mongoose;

const HowisitWork = new Schema(
  {
    version: { type: Number, required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('HowIsItWork', HowisitWork);