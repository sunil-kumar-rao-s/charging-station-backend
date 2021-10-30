const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const Admin = require("../schema/adminmodel");
const Host = require("../schema/hostmodel");
const User = require("../schema/usermodal");
const Order = require("../schema/ordermodel");
const Privacy = require('../schema/privacypolicy');
const Temrs = require('../schema/termsandcondition');
const Aboutus = require('../schema/aboutus');
const Howisitwork = require('../schema/Howisitwork');
const Notification = require('../schema/notification');
const Payment = require('../schema/payment');
const hostissue = require('../schema/hostissues');
const {
  calculateTotalAmount
} = require("../common/common");
const ChargingPoints = require('../schema/chargingpointmodel');
const Webanalytics = require('../schema/webanalytics');
const Emailsubs = require('../schema/emailsub');
const Userlogins = require('../schema/userlogins');
const Hostformschema = require('../schema/hostform');
const Investorformschema = require('../schema/investorform');
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const { findOne } = require("../schema/adminmodel");

exports.createAdminUser = [
  sanitizeBody("userName"),
  sanitizeBody("email"),
  sanitizeBody("phone"),
  sanitizeBody("password"),
  async (req, res) => {
    const admin = new Admin({
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password
    });

    try {
      let data = await admin.save();
      res.status(200).json({
        status: true,
        data,
        message: "Admin created successfully"
      });
    } catch (err) {
      res.status(409).json({
        status: false,
        message: "Email or Mobile number already exsist"
      });
    }
  }
];

exports.login = [
  sanitizeBody("email"),
  sanitizeBody("phone"),
  sanitizeBody("password"),
  async (req, res) => {
    try {
      const data = await Admin.findOne({
        $and: [{
            password: req.body.password
          },
          {
            $or: [{
              email: req.body.email
            }, {
              phone: req.body.phone
            }]
          }
        ]
      }).select("-password");
      if (data) {
        delete data.password;
        console.log("admin login data===> ", typeof data);
        res.status(200).json({
          status: true,
          message: "admin login successfully",
          data
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Invalid username or password"
        });
      }
    } catch (err) {
      res.status(410).json({
        status: false,
        message: "Invalid username or password"
      });
    }
  }
];

exports.getAllUserList = [
  sanitizeBody("adminId"),
  sanitizeBody("email"),
  sanitizeBody("phone"),
  async (req, res) => {
    try {
      let users = [],
        user;
      if (req.body.email || req.body.phone) {
        user = await User.findOne({
          $or: [{
            phone: req.body.phone
          }, {
            email: req.body.email
          }]
        });
      } else {
        users = await User.find({});
      }
      if (user || users) {
        res.status(200).json({
          status: true,
          message: "All User list populated successfully",
          users,
          user
        });
      } else {
        res.status(204).json({
          status: true,
          message: "All User not avilable"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: true,
        message: "Some thing went wrong."
      });
    }
  }
];

exports.updateUserStatus = [
  sanitizeBody("adminId"),
  sanitizeBody("userId"),
  sanitizeBody("userStatus"),
  async (req, res) => {
    try {
      let status = {
        userStatus: req.body.userStatus
      };
      let updateStatus = await User.findOneAndUpdate({
        _id: req.body.userId
      }, {
        $set: status
      }, {
        new: true
      });
      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "User status updated successfully"
        });
      } else {
        res.status(204).json({
          status: false,
          message: "User status not updated successfully"
        });
      }
    } catch (err) {
      console.log("error ", err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.getOrderList = [
  sanitizeBody("adminId"),
  async (req, res) => {
    try {
      console.log('getOrderList----> 1');
      let data = await Order.find({})
        .populate("user")
        .populate("vechicle")
        .populate("Chargingpoint")
        .populate({
          path: 'vechicle',
          populate: {
            path: 'category'
          }
        })
        .populate({
          path: 'vechicle',
          populate: {
            path: 'subCategory'
          }
        })
        .populate({
          path: 'vechicle',
          populate: {
            path: 'userId'
          }
        })
        .exec();
      console.log('getOrderList----> 2');
      if (data) {
        console.log('getOrderList----> 3');
        res.status(200).json({
          status: true,
          message: "All orders listed successfully",
          order: data
        });
      } else {
        console.log('getOrderList----> 4');
        res.json(200).json({
          status: false,
          message: "Order list empty"
        });
      }
    } catch (err) {
      console.log('getOrderList----> 5 ', err);
      res.json(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];

exports.updateOrder = [
  sanitizeBody("adminId"),
  sanitizeBody("orderId"),
  sanitizeBody("status"),
  async (req, res) => {
    try {
      let updateValue = {
        status: req.body.status
      };
      let data = await Order.findOneAndUpdate({
        _id: req.body.orderId
      }, {
        $set: updateValue
      }, {
        new: true
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Order updated successfully",
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Order not updated successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "something went wrong"
      });
    }
  }
];

exports.addStaticPage = [
  async (req, res) => {
    try {
      let privacy = new Privacy({
        version: req.body.version,
        content: req.body.content,
      });
      let data = await privacy.save();
      if (data) {
        res.status(200).json({
          status: true,
          message: 'Privcy policy inserted successfully',
          privacyPolicy: data,
        });
      } else {
        res.status(200).json({
          status: false,
          message: 'Privcy policy not inserted successfully',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Something went wrong',
      });
    }
  }
];

exports.addTermsAndCondition = [
  async (req, res) => {
    try {
      let terms = new Temrs({
        version: req.body.version,
        content: req.body.content
      });
      let data = await terms.save();
      if (data) {
        res.status(200).json({
          status: true,
          message: "Terms and condition inserted successfully",
          privacyPolicy: data
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Terms and condition not inserted successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];

exports.addAboutUs = [
  async (req, res) => {
    try {
      let aboutus = new Aboutus({
        version: req.body.version,
        content: req.body.content
      });
      let data = await aboutus.save();
      if (data) {
        res.status(200).json({
          status: true,
          message: "About us inserted successfully",
          privacyPolicy: data
        });
      } else {
        res.status(200).json({
          status: false,
          message: "About us not inserted successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];

exports.howisitwork = [
  async (req, res) => {
    try {
      let howisItWork = new Howisitwork({
        version: req.body.version,
        content: req.body.content
      });
      let data = await howisItWork.save();
      if (data) {
        res.status(200).json({
          status: true,
          message: "How is work added sucessfully",
          howIsItWork: data
        });
      } else {
        res.status(200).json({
          status: false,
          message: "About us not inserted successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
]

exports.getStaticPage = [
  async (req, res) => {
    let types = req.body.type;
    switch (req.body.type) {
      case "PRIVACY":
        try {
          let data = await Privacy.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "Privacy policy listed sucessfully",
            privacyPolicy: data
          });
        } catch (err) {
          console.log(err);
        }
        break;
      case "ABOUT":
        try {
          let data = await Aboutus.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "About us listed sucessfully",
            Aboutus: data
          });
        } catch (err) {
          console.log(err);
        }
        break;
      case "TERMS":
        try {
          let data = await Temrs.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "Terms listed sucessfully",
            terms: data
          });
        } catch (err) {
          console.log(err);
        }
        break;

      case "HOWISITWORK":
        try {
          let data = await Howisitwork.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "How is it work listed sucessfully",
            terms: data
          });
        } catch (err) {
          console.log(err);
        }
        break;
      default:
        try {
          let data = await Privacy.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "Privacy policy listed sucessfully",
            privacyPolicy: data
          });
        } catch (err) {
          console.log(err);
        }
        break;
    }
  }
];

exports.addNotification = [
  sanitizeBody('title'),
  sanitizeBody('message'),
  sanitizeBody('createdDate'),
  async (req, res) => {
    const notification = new Notification({
      title: req.body.title,
      message: req.body.message,
      createdDate: req.body.createdDate,
    });
    try {
      let data = await notification.save();
      if (data) {
        res.status(200).json({
          status: true,
          message: 'Notification Created Successfully',
          notification: data,
        });
      } else {
        res.status(200).json({
          status: false,
          message: 'Notification not Created Successfully',
        });
      }
    } catch (err) {
      console.log('err=======> ', err)
      res.status(500).json({
        status: false,
        message: 'Something went wrong',
      });
    }
  }
]

exports.activateOrdeactivateNotification = [
  sanitizeBody('notificationId'),
  sanitizeBody('isNotificationActive'),
  
  async (req, res) => {
    
    try {
     let data = await Notification.findOneAndUpdate(
        { _id: req.body.notificationId },
        { $set: {isNotificationActive: req.body.isNotificationActive} },
        { new: true }
      );
      
      if (data) {
        res.status(200).json({
          status: true,
          message: 'Notification Updated Successfully',
          notification: data,
        });
      } else {
        res.status(200).json({
          status: false,
          message: 'Notification not Updated',
        });
      }
    } catch (err) {
      
      console.log('err===================================> ', err);
      res.status(500).json({
        status: false,
        message: 'Something went wrong while updating the notification',
      });
    }
  }
]

exports.dashBoard = [
  async (req, res) => {
    try {
      const user = await User.find({});
      const payments = await Payment.find({});
      const chargingPoints = await ChargingPoints.find({});
      const AdminUsers = await Admin.find({});
      let totalAmount = await calculateTotalAmount(payments);
      res.status(200).json({
        status: true,
        users: user,
        payments,
        totalAmount,
        totalCharged: 0,
        activeCharging: 5,
        chargingPoints,
        AdminUsers,
        totalHoast: 5
      });
    } catch (e) {
      res.status(500).json({
        status: true,
        message: 'Something went wrong'
      });
    }

  }
];

exports.updateHostIssueStatus = [
  sanitizeBody("adminId"),
  sanitizeBody("issueId"),
  sanitizeBody("resolved"),
  sanitizeBody("comments"),
  async (req, res) => {
    try {
      let resolved = {
        resolved: req.body.resolved,
        comments: req.body.comments
      };
      let updateStatus = await hostissue.findOneAndUpdate({
        _id: req.body.issueId
      }, {
        $set: resolved
      }, {
        new: true
      });
      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "Resolved Status and comment updated successfully"
        });
      } else {
        res.status(204).json({
          status: false,
          message: "Resolved status and comment not updated successfully"
        });
      }
    } catch (err) {
      console.log("error ", err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.updateHostStatus = [
  sanitizeBody("adminId"),
  sanitizeBody("hostId"),
  sanitizeBody("hostStatus"),
  async (req, res) => {
    try {
      let status = {
        hostStatus: req.body.hostStatus
      };
      let updateStatus = await Host.findOneAndUpdate({
        _id: req.body.hostId
      }, {
        $set: status
      }, {
        new: true
      });
      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "User status updated successfully"
        });
      } else {
        res.status(204).json({
          status: false,
          message: "User status not updated successfully"
        });
      }
    } catch (err) {
      console.log("error ", err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.getAllHostList = [
  sanitizeBody("adminId"),
  sanitizeBody("email"),
  sanitizeBody("mobileNumber"),
  async (req, res) => {
    try {
      let hosts = [],
        host;
      if (req.body.email || req.body.phone) {
        host = await Host.findOne({
          $or: [{
            phone: req.body.phone
          }, {
            email: req.body.email
          }]
        });
      } else {
        hosts = await Host.find({});
      }
      if (host || hosts) {
        res.status(200).json({
          status: true,
          message: "All Host list populated successfully",
          hosts,
          host
        });
      } else {
        res.status(204).json({
          status: true,
          message: "All Host not avilable"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: true,
        message: "Some thing went wrong."
      });
    }
  }
];

exports.getwebsitevisitors = [
  sanitizeBody("adminId"),
  
  async (req, res) => {
    try {
    
      let visitors = await Webanalytics.find({});
      if (visitors) {
        res.status(200).json({
          status: true,
          message: "All website visitor;s details populated successfully",
          visitors
        });
      } else {
        res.status(204).json({
          status: false,
          message: "visitors details not avilable"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.getemailsubs = [
  sanitizeBody("adminId"),
  
  async (req, res) => {
    try {
    
      let subs = await Emailsubs.find({});
      if (subs) {
        res.status(200).json({
          status: true,
          message: "email subscribers populated successfully",
          subs
        });
      } else {
        res.status(204).json({
          status: false,
          message: "subscriber details not avilable"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];



exports.getAppuserlogins = [
  sanitizeBody("adminId"),
  
  async (req, res) => {
    try {
    
      let userlogins = await Userlogins.find({});
      if (userlogins) {
        res.status(200).json({
          status: true,
          message: "recent app logins populated successfully",
          userlogins
        });
      } else {
        res.status(204).json({
          status: false,
          message: "app user login details not avilable"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.gethostform = [
  sanitizeBody("adminId"),
  
  async (req, res) => {
    try {
    
      let hosts = await Hostformschema.find({});
      if (hosts) {
        res.status(200).json({
          status: true,
          message: "host forms populated successfully",
          hosts
        });
      } else {
        res.status(204).json({
          status: false,
          message: "host form details not avilable"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.getinvestorform = [
  sanitizeBody("adminId"),
  
  async (req, res) => {
    try {
    
      let investors = await Investorformschema.find({});
      if (investors) {
        res.status(200).json({
          status: true,
          message: "investor forms populated successfully",
          investors
        });
      } else {
        res.status(204).json({
          status: false,
          message: "investor form details not avilable"
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];


exports.getSalt = [
  sanitizeBody("password"),
  
  async (req, res) => {
    try {
     
      let salt = uuidv1();
      let encry_password = crypto
      .createHmac("sha256", salt)
      .update(req.body.password)
      .digest("hex");
    
      let hashData = {
        salt: salt,
        encry_password: encry_password
      }
      res.status(200).json({
        status: true,
        message: "hashed and salted successfully",
        hashData
      });
      


    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Some thing went wrong."
      });
    }
  }
];

exports.decryptPass = [
  sanitizeBody("salt"),
  sanitizeBody("plain_password"),
  
  async (req, res) => {
    try {
     
      let salt = req.body.salt;
      let encry_password = crypto
      .createHmac("sha256", salt)
      .update(req.body.plain_password)
      .digest("hex");
    
      let hashData = {
        salt: salt,
        password: encry_password
      }
      res.status(200).json({
        status: true,
        message: "hashed and salted successfully",
        hashData
      });
      


    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Some thing went wrong."
      });
    }
  }
];

exports.encryUserPassword = [
  sanitizeBody("userId"),
  
  async (req, res) => {
    try {
      
      let userData = await User.findOne({_id:req.body.userId});
      console.log('---------------------------------------------'+userData.password);
      
      let salt = uuidv1();
      let encry_password = crypto
      .createHmac("sha256", salt)
      .update(userData.password)
      .digest("hex");
    
      let hashData = {
        salt: salt,
        encry_password: encry_password
      }

      await User.findOneAndUpdate({_id:req.body.userId},
        
         {  $set:{ salt: salt,
          encry_password: encry_password,
        password:''}},{upsert:true},function(err,docs){
            if(err){
              console.log(err);
            }
            else{
              console.log(docs);
              res.status(200).json({
                status: true,
                message: "hashed and salted successfully",
                hashData
              });
            }
          }
        );

    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Some thing went wrong."
      });
    }
  }
];

exports.addStationImages = [
  sanitizeBody("adminId"),
  sanitizeBody("chargingstationId"),
  sanitizeBody("imageLink"),
  
  async (req, res) => {
    try {
      
      let linkdata = await ChargingPoints.findByIdAndUpdate({_id:req.body.chargingstationId},
        {$addToSet:{imageLink:[req.body.imageLink]}},{upsert:true},function(err,docs){
          if(err){
            console.log(err);
          }
          else{
            res.status(200).json({
              status: true,
              message: "Image Link inserted Successfully",
              docs
            });
          }
        });
     
        
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Some thing went wrong."
      });
    }
  }
];