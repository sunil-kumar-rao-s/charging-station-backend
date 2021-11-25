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
const TimeSlot = require('../schema/timeslots');
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const {
  findOne
} = require("../schema/adminmodel");

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
      await admin.save({}, function (err, resp) {
        if (err) {

          res.status(203).json({

            status: false,
            message: "Cannot able to create admin user.",
            error: err

          });
        } else {

          res.status(200).json({
            status: true,
            message: "Admin created successfully.",
            data: resp
          });
        }
      });

    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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

        res.status(200).json({
          status: true,
          message: "Admin login successfully.",
          data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Invalid username or password."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "Users list populated successfully.",
          users,
          user
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Users not found."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "User status updated successfully."
        });
      } else {
        res.status(203).json({
          status: false,
          message: "User status not updated."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

exports.getOrderList = [
  sanitizeBody("adminId"),
  async (req, res) => {
    try {

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

      if (data) {

        res.status(200).json({
          status: true,
          message: "All orders listed successfully.",
          order: data
        });
      } else {

        res.json(203).json({
          status: false,
          message: "Order list empty."
        });
      }
    } catch (err) {

      res.json(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "Order updated successfully.",
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Order not updated."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "something went wrong!!!",
        error: err
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
          message: 'Privcy policy added successfully.',
          privacyPolicy: data,
        });
      } else {
        res.status(203).json({
          status: false,
          message: 'Cannot able to add privacy policy.',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Something went wrong!!!',
        error: err
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
          message: "Terms and conditions added successfully.",
          privacyPolicy: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to add terms and conditions."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "About us added successfully.",
          privacyPolicy: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to add about us."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "How it works added sucessfully.",
          howIsItWork: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to add how it works."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
            message: "Privacy policy listed sucessfully.",
            privacyPolicy: data
          });
        } catch (err) {

          res.status(500).json({
            status: false,
            message: "Something went wrong!!!",
            error: err
          });
        }
        break;
      case "ABOUT":
        try {
          let data = await Aboutus.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "About us listed sucessfully.",
            Aboutus: data
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            message: "Something went wrong!!!",
            error: err
          });
        }
        break;
      case "TERMS":
        try {
          let data = await Temrs.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "Terms and conditions listed sucessfully.",
            terms: data
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            message: "Something went wrong!!!",
            error: err
          });
        }
        break;

      case "HOWISITWORK":
        try {
          let data = await Howisitwork.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "How it works listed sucessfully.",
            terms: data
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            message: "Something went wrong!!!"
          });
        }
        break;
      default:
        try {
          let data = await Privacy.find({}).sort({
            createdAt: -1
          });
          res.status(200).json({
            status: true,
            message: "Privacy policy listed sucessfully.",
            privacyPolicy: data
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            message: "Something went wrong!!!",
            error: err
          });
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
          message: 'Notification added successfully.',
          notification: data,
        });
      } else {
        res.status(203).json({
          status: false,
          message: 'Cannot able to add notification.'
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: 'Something went wrong',
        error: err
      });
    }
  }
]

exports.activateOrdeactivateNotification = [
  sanitizeBody('notificationId'),
  sanitizeBody('isNotificationActive'),

  async (req, res) => {

    try {
      let data = await Notification.findOneAndUpdate({
        _id: req.body.notificationId
      }, {
        $set: {
          isNotificationActive: req.body.isNotificationActive
        }
      }, {
        new: true
      });

      if (data) {
        res.status(200).json({
          status: true,
          message: 'Notification updated successfully.',
          notification: data,
        });
      } else {
        res.status(203).json({
          status: false,
          message: 'Notification not updated.',
        });
      }
    } catch (err) {


      res.status(500).json({
        status: false,
        message: 'Something went wrong while updating the notification',
        error: err
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
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Something went wrong!!!',
        error: err
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
          message: "Resolved status and comment updated successfully."
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Resolved status and comment not updated."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "User status updated successfully."
        });
      } else {
        res.status(203).json({
          status: false,
          message: "User status not updated."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "All host listed successfully.",
          hosts,
          host
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Hosts not avilable."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "All website visitor details listed successfully.",
          visitors
        });
      } else {
        res.status(203).json({
          status: false,
          message: "visitors details not avilable."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "Email subscribers listed successfully.",
          subs
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Subscriber details not avilable."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "Recent app logins listed successfully.",
          userlogins
        });
      } else {
        res.status(203).json({
          status: false,
          message: "App user login details not avilable."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "Host forms listed successfully.",
          hosts
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Host form details not avilable."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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
          message: "Investor forms listed successfully.",
          investors
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Investor form details not avilable."
        });
      }
    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
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

      let userData = await User.findOne({
        _id: req.body.userId
      });

      console.log(userData)
        console.log(userData.password)
      let salt = uuidv1();
      let encry_password = crypto
        .createHmac("sha256", salt)
        .update(userData.password)
        .digest("hex");

      let hashData = {
        salt: salt,
        encry_password: encry_password
      }

      await User.findOneAndUpdate({
          _id: req.body.userId
        },

        {
          $set: {
            salt: salt,
            encry_password: encry_password,
            password: ''
          }
        }, {
          upsert: true
        },
        function (err, docs) {
          if (err) {
            
          } else {
           
            res.status(200).json({
              status: true,
              message: "hashed and salted successfully",
              hashData
            });
          }
        }
      );

    } catch (err) {
      console.log(err)
      res.status(500).json({
        status: false,
        message: "Some thing went wrong.",
        err: err
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

      let linkdata = await ChargingPoints.findByIdAndUpdate({
        _id: req.body.chargingstationId
      }, {
        $addToSet: {
          imageLink: [req.body.imageLink]
        }
      }, {
        upsert: true
      }, function (err, docs) {
        if (err) {
          res.status(203).json({
            status: false,
            message: "Cannot able to add image link.",

          });
        } else {
          res.status(200).json({
            status: true,
            message: "Image link added successfully.",
            docs
          });
        }
      });


    } catch (err) {

      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

exports.addTimeSlot = [
  sanitizeBody("chargingstationId"),
  sanitizeBody("time"),
  sanitizeBody("price"),


  async (req, res) => {
    try {

      let timeslot = new TimeSlot({
        chargingstationId: req.body.chargingstationId,
        time: req.body.time,
        price: req.body.price
      });

      let timeslotdata = await timeslot.save();

      if (timeslotdata) {
        await ChargingPoints.findByIdAndUpdate({
            _id: req.body.chargingstationId
          }, {
            $addToSet: {
              price: timeslotdata._id
            }
          }, {
            new: true
          },
          function (err, docs) {
            if (err) {
              res.status(203).json({
                status: false,
                message: "cannot able to add pricing details."
              });
            } else {
              res.status(200).json({
                status: true,
                message: "pricing details added successfully."
              });
            }
          });

      }

    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

exports.editTimeSlot = [
  sanitizeBody("timeSlotId"),
  sanitizeBody("time"),
  sanitizeBody("price"),


  async (req, res) => {
    try {

      let timeslot = {
        chargingstationId: req.body.chargingstationId,
        time: req.body.time,
        price: req.body.price
      }

      await TimeSlot.findByIdAndUpdate({_id: req.body.timeSlotId},
        {$set: timeslot},{new:true},function(err,docs){
          if(err){
            res.status(203).json({
              status: false,
              message: "Cannot able to update pricing details."
            });
          }
          else{
            res.status(200).json({
              status: true,
              message: "pricing details updated successfully."
            });
          }
        });
      

    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

exports.deleteTimeSlot = [
  sanitizeBody("timeSlotId"),  
  async (req, res) => {
    try {
      
     let data = await ChargingPoints.findByIdAndUpdate({_id: req.body.chargingstationId},
        {$pull:{'price':req.body.timeSlotId}},{new:true,upsert:true});
      if(data){
      await TimeSlot.findByIdAndDelete({_id: req.body.timeSlotId},
        function(err,docs){
          if(err){
            res.status(203).json({
              status: false,
              message: "Cannot able to delete pricing details."
            });
          }
          else{
           
            res.status(200).json({
              status: true,
              message: "Pricing details deleted successfully."
            });
          }
        });
      }

    } catch (err) {
     
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];