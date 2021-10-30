const mongoose = require("mongoose");
const { Schema } = mongoose;

const Timeslots = new Schema(
  {
    time: { type: String, required: true },
    price: {type:String, required: true},

  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Timeslots', Timeslots);