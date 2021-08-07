const mongoose = require("mongoose");
const { Schema } = mongoose;

const hostIssuesSchema = new Schema(
  {
    hostId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String },
    resolved: {type: String, default:"Submitted"},
    comments:{type: String, default:"Executive will contact you shortly"}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Hostissues", hostIssuesSchema);
