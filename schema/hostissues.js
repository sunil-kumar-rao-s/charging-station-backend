const mongoose = require("mongoose");
const { Schema } = mongoose;

const hostIssuesSchema = new Schema(
  {
    hostId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String },
    resolved: {type: Boolean, default:false}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Hostissues", hostIssuesSchema);
