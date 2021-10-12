const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const User = require("../schema/usermodal");
const Payment = require("../schema/payment");
const Razorpay = require("razorpay");
const Privacy = require("../schema/privacypolicy");
const Temrs = require("../schema/termsandcondition");
const Aboutus = require("../schema/aboutus");
const jwt = require("jsonwebtoken");
const Howisitwork = require("../schema/Howisitwork");
const OtpSchema = require("../schema/otpmodel");
const Notification = require("../schema/notification");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const Userlogins = require("../schema/userlogins");
const util = require("util");
require("../controller/watchlist");






var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createUser = [
  sanitizeBody("userName").trim(),
  sanitizeBody("email").trim(),
  sanitizeBody("phone").trim(),
  sanitizeBody("city").trim(),
  sanitizeBody("password").trim(),
  sanitizeBody("isVerified").trim(),
  async (req, res) => {
    try {
      let mobileNumberData = await User.findOne({
        $or: [{
          phone: req.body.phone,
          email: req.body.email
        }]
      });
      if (mobileNumberData) {
        res.status(203).json({
          status: false,
          message: "Email or Phone number already exist"
        });
      } else {
        const user = new User({
          userName: req.body.userName,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          password: req.body.password,
          isVerified: req.body.isVerified,
        });
        try {
          const data = await user.save();
          res.status(200).json({
            status: true,
            data
          });
        } catch (err) {
          console.log(err);
          res.status(200).json({
            status: false,
            message: "Email or Phone number already exist."
          });
        }
      }
    } catch (err) {
      res.status(200).json({
        status: false,
        message: "Email or Phone number already exist"
      });
    }
  }
];

exports.login = [
  sanitizeBody("email").trim(),
  sanitizeBody("phone").trim(),
  sanitizeBody("password").trim(),
  sanitizeBody("deviceId").trim(),
  sanitizeBody("deviceType").trim(),
  async (req, res) => {
    try {
      let data = await User.findOne({
        $and: [{
            password: req.body.password
          },
          {
            $or: [{
              phone: req.body.phone
            }, {
              email: req.body.email
            }]
          }
        ]
      }).select("-password");
      if (data) {

        const devicedata = new Userlogins({

          userId: data._id,
          deviceId: req.body.deviceId,
          deviceType: req.body.deviceType,
          userName: data.userName,
          email: data.email,
          phone: data.phone,

        });
        
        devicedata.save(function(err,docs){
          if(err){
            console.log(err);
          }
          else{
            console.log(docs);
          }
        });

        let lastDate = Date.now();
        let lastloginDate = {
          lastActiveAt: lastDate
        };
        let updateData = await User.findOneAndUpdate({
          _id: data._id
        }, {
          $set: lastloginDate
        }, {
          new: true
        });
        const jwtToken = jwt.sign({
          email: req.body.email
        }, "accessToken");
        console.log("accessToekn=====> ", jwtToken);
        data.lastActiveAt = lastDate;
        res.status(200).json({
          status: true,
          data: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "invalid Phone number or password"
        });
      }
    } catch (err) {
      res.status(203).json({
        status: false,
        message: "invalid Phone number or password"
      });
    }
  }
];

exports.getProfile = async (req, res) => {
  try {
    console.log("view profile called");
    let data = await User.findOne({
      _id: req.query.id
    }).select("-password");
    res.status(200).json({
      status: true,
      profileData: data
    });
  } catch (err) {
    res.status(401).json({
      status: false,
      message: "Profile Details not found"
    });
  }
};

exports.updateProfile = [
  sanitizeBody("id").trim(),
  sanitizeBody("userName").trim(),
  sanitizeBody("email").trim(),
  sanitizeBody("city").trim(),
  async (req, res) => {
    console.log("update profile called");
    let updateValue = {
      userName: req.body.userName,
      email: req.body.email,
      city: req.body.city
    };
    try {
      let data = await User.findOneAndUpdate({
        _id: req.body.id
      }, {
        $set: updateValue
      }, {
        new: true
      }).select("-password");
      if (data) {
        res.status(200).json({
          status: true,
          message: "Profile updated successfully",
          data
        });
      } else {
        res.status(401).json({
          status: true,
          message: "request user not found",
          data
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Email or Phone number already exsist with another user"
      });
    }
  }
];

exports.updatePassword = [
  sanitizeBody("id").trim(),
  sanitizeBody("oldPassword").trim(),
  sanitizeBody("newPassword").trim(),
  async (req, res) => {
    try {
      let data = await User.findOne({
        _id: req.body.id,
        password: req.body.oldPassword
      });
      if (data) {
        let newData = await User.updateOne({
          _id: req.body.id
        }, {
          $set: {
            password: req.body.newPassword
          }
        }, {
          new: true
        });
        if (newData) {
          res.status(200).json({
            status: true,
            message: "password updated successfully"
          });
        } else {
          res.status(500).json({
            status: false,
            message: "User already exist please try with diffrent email/phone or login"
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "user id or old password mismatch"
        });
      }
    } catch (err) {
      res.status(404).json({
        status: false,
        message: "user id or old password mismatch"
      });
    }
  }
];
exports.updateWallet = [
  sanitizeBody("userId"),
  sanitizeBody("paymentId"),
  sanitizeBody("razarPayPaymentId"),
  async (req, res) => {
    let data;

    data = await instance.orders.fetch(req.body.paymentId);
    if (
      data.amount === data.amount_paid &&
      data.amount_due === 0 &&
      data.receipt === "WALLET" &&
      data.notes.userId === req.body.userId
    ) {
      try {
        let updatePaymentData = {
          paidFrom: "WALLET",
          amount: data.amount_paid / 100,
          isPaid: true,
          razarPayPaymentId: req.body.razarPayPaymentId
        };

        let dataRecord = await Payment.findOneAndUpdate({
          $and: [{
            paymentId: req.body.paymentId,
            userId: req.body.userId
          }]
        }, {
          $set: updatePaymentData
        }, {
          new: true
        });
        if (dataRecord) {
          let previousAmount = await User.findOne({
            _id: req.body.userId
          });
          let totalAmount;
          if (previousAmount) {
            totalAmount = previousAmount.walletAmount + data.amount_paid / 100;
          } else {
            totalAmount = data.amount_paid / 100;
          }
          let update = await User.findOneAndUpdate({
            _id: req.body.userId
          }, {
            $set: {
              walletAmount: totalAmount
            }
          }, {
            new: true
          });
          if (update) {
            res.status(200).json({
              status: true,
              message: "wallet amount updated successfully",
              walletAmount: update.walletAmount
            });
          } else {
            res.status(200).json({
              status: true,
              message: "wallet amount not able to update in user table"
            });
          }
        } else {
          res.status(200).json({
            status: false,
            message: "Payment Data not updated successfully in payment table"
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          status: false,
          message: "Something went wrong"
        });
      }
    }
  }
];

exports.getTranscationDetails = [
  sanitizeBody("userId"),
  async (req, res) => {
    try {
      let data = await Payment.find({
        userId: req.body.userId
      }).populate(
        "orderId"
      );
      if (data) {
        res.status(200).json({
          status: true,
          message: "Transcation history listed sucessfully",
          transcationHistory: data
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Transcation history not listed sucessfully"
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
            privacyPolicy: data[0]
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
            Aboutus: data[0]
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
            terms: data[0]
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
            privacyPolicy: data[0]
          });
        } catch (err) {
          console.log(err);
        }
        break;
    }
  }
];

exports.getNotification = [
  async (Req, res) => {
    try {
      let data = await Notification.find({}).sort({
        createdDate: -1
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Notification listed successfully",
          notifications: data
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Notification listed is empty"
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

exports.sendOtp = [
  sanitizeBody("phone"),
  async (req, res) => {
    try {

      let OTP = '';
      for (let i = 0; i < 6; i++) {
        OTP += [Math.floor(Math.random() * 10)];
      }
      client.messages
        .create({
          body: 'Welcome to FeedMyEv, Your OTP is: ' + OTP + ' This OTP is valid for next 10 mins only. Never share this code with anyone. ',
          messagingServiceSid: process.env.MESSAGE_SERVICE_ID,
          to: req.body.phone
        })
        .then(console.log("otp sent"))
        .done();
      let data = await OtpSchema.findOne({
        phone: req.body.phone
      })
      if (data) {

        let data1 = await OtpSchema.findOneAndUpdate({
          phone: req.body.phone
        }, {
          $set: {
            otp: OTP
          }
        }, {
          new: true
        }, function (err, docs) {
          if (err) {
            console.log(err),
            res.status(200).json({
              status: false,
              message: "couldnt send OTP"
            });
          } else {
            console.log("Doc : ", docs),
            res.status(200).json({
              status: true,
              message: "OTP sent successfully",
              
            });
          }
        });
        

      } else {

        const phoneotp = new OtpSchema({

          phone: req.body.phone,
          otp: OTP

        });
        try {
          const data = await phoneotp.save();
          res.status(200).json({
            status: true,
            
          });
        } catch (err) {
          res.status(200).json({
            status: false,
            message: "couldnt send OTP"
          });
        }
      }


    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];


exports.otpAuth = [
  sanitizeBody("otp"),
  sanitizeBody("phone"),
  async (req, res) => {
    try {


      let data = await OtpSchema.findOne({
        phone: req.body.phone,
        otp: req.body.otp

      });


      if (data) {
        res.status(200).json({
          status: true,
          message: "otp auth successful",
          data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Incorrect OTP",
          data
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

exports.forgotPassword = [
  
  sanitizeBody("phone").trim(),
  sanitizeBody("newPassword").trim(),
  sanitizeBody("Key").trim(),
  async (req, res) => {
    try {
      let data = await User.findOneAndUpdate({
        phone: req.body.phone,
        Key: req.body.Key
      }, {
        $set: {
          password: req.body.newPassword
        }
      }, {
        new: true
      });
      console.log(data);
      
        if (data) {
          res.status(200).json({
            status: true,
            message: "password updated successfully"
          });
        } else {
          res.status(500).json({
            status: false,
            message: "couldn't update password!!!"
          });
        }
      
    } catch (err) {
      console.log(err);
      res.status(404).json({
        status: false,
        message: "user id or Key mismatch"
      });
    }
  }
];

exports.otpAuth2 = [
  sanitizeBody("otp"),
  sanitizeBody("phone"),
  async (req, res) => {
    try {


      let data = await OtpSchema.findOne({
        phone: req.body.phone,
        otp: req.body.otp

      });
      console.log(data);

      let newKey = '';
      for (let i = 0; i < 10; i++) {
        newKey += [Math.floor(Math.random() * 10)];
      }

      let userdata = await User.findOneAndUpdate({
        phone: req.body.phone
      }, {
        $set: {
          Key: newKey
        }
      }, {
        new: true
      });
      if(userdata){
        console.log("found+++++++++++++++++++++++++++++");
        
      }
      else{
        console.log("____________________________notfound");
      }
     

      if (data) {
        res.status(200).json({
          status: true,
          message: "otp auth successful",
          Key: newKey
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Incorrect OTP",
          
        });
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];



exports.call = [
  sanitizeBody("phone"),
  async (req, res) => {
    try {

     console.log(req.body.phone);
      client.calls
      .create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: req.body.phone,
        from: '+12018796637',
      })
      .then(call => console.log(call.sid));
      res.status(200).json({
        status: true,
        message: "Something went wrong"
      });
     

    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];
