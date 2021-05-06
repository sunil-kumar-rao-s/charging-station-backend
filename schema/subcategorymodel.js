const mongoose = require("mongoose");
const { Schema } = mongoose;


const SubcategorySchema = new Schema({
    subCategoryName: { type: String, required: true, unique:true },
    active: {type: Boolean, default: true},
    categoryId: {type: Schema.ObjectId}
  },{
      timestamps: true
  });
  
  module.exports = mongoose.model('Subcategory', SubcategorySchema);