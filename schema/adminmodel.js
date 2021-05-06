const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
    userName: {type:String, required: true},
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},{
    timestamps:true,
});
module.exports= mongoose.model('Admin', AdminSchema);