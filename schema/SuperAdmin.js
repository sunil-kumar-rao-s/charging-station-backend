const mongoose = require('mongoose');
const {Schema} = mongoose;

const superAdmin = new Schema(
    {
        firstName: {type: String, required: false},
        lastName: {type: String, required: false},
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: {type: String, required: true}
    },{capped: true,size: 1024, max:1, timestamps: true}
)

module.exports = mongoose.model("superadmin", superAdmin);
