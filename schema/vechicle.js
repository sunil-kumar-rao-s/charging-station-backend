const mongoose = require("mongoose");
const { Schema } = mongoose;

const VechcicleSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true
    },
    vechicleNumber: { type: String, required: true, unique: true },
    vechicleType: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Vechicle", VechcicleSchema);
