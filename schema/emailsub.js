const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailsub = new Schema({
    email:{type:String,required:true},
});

module.exports = mongoose.model("emailsub", emailsub);