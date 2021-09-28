const mongoose = require("mongoose");
const { Schema } = mongoose;

const webanalyticsschema = new Schema({
    ip: { type: String, required: true },
    browserName: { type: String, required: true },
    browserVersion:{type:String,required:true},
    time:{type:String,required:true},
    pageVisited:{type:String}
},{
    timestamps: true
})

module.exports = mongoose.model('Watchlist', WatchListSchema);