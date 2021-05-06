    const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  paymentId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderType: { type: String, enum: ["WALLET", "ORDER"], required: true },
  paidFrom: {type: String, enum:['WALLET',"RAZORPAY"]},
  amount: {type: Number, required: true },
  orderId: {type: Schema.Types.ObjectId, ref:'Order' },
  isPaid: {type:Boolean, default: false},
  razarPayPaymentId: {type: String}  
},{
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);