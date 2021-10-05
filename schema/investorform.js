const mongoose = require("mongoose");
const { Schema } = mongoose;

const investorform = new Schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
    comments:{type:String,required:true},
    mobile:{type:String,required:true},
});

module.exports = mongoose.model("investorform", investorform);