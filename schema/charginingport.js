const mongoose = require("mongoose");
const { Schema } = mongoose;

const CharginingPortSchema = new Schema({
    chargingstationId: {type: String, required: true},
    uniqueId: {type:String, required:true},
    isOnline: {type: Boolean, default: true},
    chargerType: {type:String, required: true},
    maxChargingSpeed: {type: Number, required: true},
    description: {type: String, required: true},
});

module.exports = mongoose.model("Chargingpoint", CharginingPortSchema);