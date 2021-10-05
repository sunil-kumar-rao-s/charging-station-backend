const mongoose = require("mongoose");
const { Schema } = mongoose;

const hostform = new Schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    businesstype:{type:String,required:true},
    mobile:{type:String,required:true},
});

module.exports = mongoose.model("hostForm", hostform);