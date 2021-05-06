const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    bookingDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vechicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vechicle",
      required: true
    },
    chargingPointId: {
      type: Schema.Types.ObjectId,
      ref: "ChargingPoint",
      required: true
    },
    status: {
      type: String,
      enum: ["CREATED", "APPROVED", "REJECTED", "PAID"],
      default: "CREATED"
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Order", OrderSchema);