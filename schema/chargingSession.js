const mongoose = require("mongoose");
const { Schema } = mongoose;

const Charging_SessionSchema = new Schema({
    uid: {type:String, required: true},
    userId: { type: String, required: true },
    startMeterReading: { type: String, required: true },
    endMeterReading: { type: String, required: true , default: "not yet received"}, //updates while stop charging
    startTime: { type: String, required: true },
    endTime: { type: String, required: true, default: "not yet received" },
    consumption: { type: Number, required: true, default:0 },
    sessionId: { type: String, required: true, unique: true},
    hostId: { type: String, required: true },
    chargedAmount: { type: String, required: true, default: "0" },
    isSessionActive: { type:String, required: true,default:"True"},
    ratings: { type:String, required: true,default:"0"},
    reviews: { type:String, required: true,default:"no reviews"},
    timeslotid:{type:String,default:"null"}

},{
    timestamps:true,
});
module.exports= mongoose.model('session', Charging_SessionSchema);