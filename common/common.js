const Admin = require("../schema/adminmodel");
const User = require('../schema/usermodal');
const Host = require('../schema/hostmodel');

exports.checkAdmin = async (req, res, next) => {
  try {
    let data = await Admin.findOne({ _id: req.body.adminId });
    console.log(data);
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
    console.log(req.body.userId);
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


exports.checkHost = async (req, res, next) => {
  try {
    let data = await Host.findOne({ _id: req.query.hostId });
    
    if (data) {
      if(data.hostStatus == "true"){
        next();
      }
      else{
        res.status(200).json({
          status: false,
          message: "This user is Blocked"
        });
      }
     
    } else {
      res.status(200).json({
        status: false,
        message: "This user is not a host"
      });
    }
  } catch (err) {
    res.status(200).json({
        status: false,
        message: "This user is not a host"
      });
  }
};

exports.postcheckHost = async (req, res, next) => {
  try {
    let data = await Host.findOne({ _id: req.body.hostId });
    
    if (data) {
      if(data.hostStatus == "true"){
        next();
      }
      else{
        res.status(200).json({
          status: false,
          message: "This user is Blocked"
        });
      }
     
    } else {
      res.status(200).json({
        status: false,
        message: "This user is not a host"
      });
    }
  } catch (err) {
    res.status(200).json({
        status: false,
        message: "This user is not a host"
      });
  }
};