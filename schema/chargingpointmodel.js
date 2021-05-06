const mongoose = require("mongoose");
const { Schema } = mongoose;

const CharginPointSchema = new Schema({
  uniqueId: { type: String, required: true, unique: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rating: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: true },
  pointName: { type: String, required: true },
  portCount: { type: Number },
  avilablePort: { type: Number },
  landMark: { type: String },
  address: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  port: [{ type: Schema.Types.ObjectId, ref: 'Chargingpoint' }]
});

CharginPointSchema.virtual("latitude").get(function() {
  return this.location.coordinates[1];
});

CharginPointSchema.virtual("longitude").get(function() {
  return this.location.coordinates[0];
});

CharginPointSchema.set("toObject", { virtuals: true });
CharginPointSchema.set("toJSON", { virtuals: true });
CharginPointSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Chargingstation", CharginPointSchema);
