const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchListSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chargingPointId: { type: Schema.Types.ObjectId, ref: "ChargingPoint", required: true },
},{
    timestamps: true
})

module.exports = mongoose.model('Watchlist', WatchListSchema);