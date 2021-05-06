const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  categoryName: { type: String, required: true, unique:true },
  active: {type: Boolean, default: true}
},{
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
