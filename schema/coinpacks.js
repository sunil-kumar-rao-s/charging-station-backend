const mongoose = require("mongoose");
const { Schema } = mongoose;

const CoinpackSchema = new Schema({
    packId: {type: String, required: true},
    packName: {type: String, required: true},
    packAmount: {type: String, required: true},
    packDiscount: {type: String, required: true,default:"not set"},
    isDiscount: {type: String, required: true,default:"false"},
    numberOfCoins: {type: String, required: true},
    description: {type: String, required: true},
   
    
});

module.exports = mongoose.model("Coinpacks", CoinpackSchema);