const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    businessType: { type: String, required: true }, //dropdown, create an API for business type
    businessPan: { type: String, required: true, unique: true },
    aadharNumber: { type: String, required: true, unique: true },
    businessPhoto: { type: String, required: true },//will get a link from body (cdn)
    hostPhoto: { type: String, required: true }, //will get a link from body (cdn)
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    businessSize: { type: String, required: true },
    businessName: { type: String, required: true },
    businessPhone: { type: String, required: true, unique: true },
    openTime: { type: String, required: true },
    lastActiveAt: {type:Date},
    hostStatus: {type: String, default: true},
    businessWebsite: { type: String, required: true },
    chargerFor: { type: String, required: true }, //bike or car
    password: { type: String, required: true } 
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Host", UserSchema);
