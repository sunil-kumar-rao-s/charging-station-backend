const mongoose = require("mongoose");
const { Schema } = mongoose;

const CharginingPortSchema = new Schema({
    chargingstationId: {type: String, required: true},
   
    isOnline: {type: String, default: true},
    chargerType: {type:String, required: true},
    maxChargingSpeed: {type: Number, required: true},
    description: {type: String, required: true},
    hostId: { type: String, required: true },
    qrId:{type:String,required:true},
});

module.exports = mongoose.model("Chargingport", CharginingPortSchema);