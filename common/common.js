const Admin = require("../schema/adminmodel");
const User = require('../schema/usermodal');

exports.checkAdmin = async (req, res, next) => {
  try {
    let data = await Admin.findOne({ _id: req.body.adminId });
    if (data) {
      next();
    } else {
      res.status(200).json({
        status: false,
        message: "This user is not a admin"
      });
    }
  } catch (err) {
    res.status(200).json({
        status: false,
        message: "This user is not a admin"
      });
  }
};


exports.checkUser = async (req, res, next) => {
  try {
    let data = await User.findOne({ _id: req.body.userId });
    if (data) {
      next();
    } else {
      res.status(200).json({
        status: false,
        message: "This user is not a customer"
      });
    }
  } catch (err) {
    res.status(200).json({
        status: false,
        message: "This user is not a customer"
      });
  }
};

exports.calculateTotalAmount = async (transcationList) => {
  let totalAmount = 0;
  if (transcationList.length >0) {
    await  transcationList.forEach((item) => {
      if (item.isPaid){
        totalAmount = totalAmount+ item.amount
      }
    });
  }
  return totalAmount;
}
