const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const Host = require("../schema/hostmodel");
const Issues = require("../schema/hostissues");
const jwt = require("jsonwebtoken");
const ChargingStations = require("../schema/chargingpointmodel");
const ChargingPorts = require("../schema/charginingport");
const showSessionmodel = require("../schema/chargingSession");


exports.createHost = [
  sanitizeBody("firstName").trim(),
  sanitizeBody("lastName").trim(),
  sanitizeBody("email").trim(),
  sanitizeBody("phone").trim(),
  sanitizeBody("city").trim(),
  sanitizeBody("state").trim(),
  sanitizeBody("businessType").trim(),
  sanitizeBody("businessPan").trim(),
  sanitizeBody("aadharNumber").trim(),
  sanitizeBody("businessPhoto").trim(),
  sanitizeBody("latitude").trim(),
  sanitizeBody("longitude").trim(),
  sanitizeBody("businessSize").trim(),
  sanitizeBody("businessName").trim(),
  sanitizeBody("businessPhone").trim(),
  sanitizeBody("openTime").trim(),
  sanitizeBody("businessWebsite").trim(),
  sanitizeBody("chargerFor").trim(),
  sanitizeBody("password").trim(),
  async (req, res) => {
    try {
      console.log("------------------------------------------inside first try block")
      const host = new Host({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        city: req.body.city,
        password: req.body.password,
        email: req.body.email,
        state: req.body.state,
        businessType: req.body.businessType,
        businessPan: req.body.businessPan,
        aadharNumber: req.body.aadharNumber,
        businessPhoto: req.body.businessPhoto,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        businessSize: req.body.businessSize,
        businessPhone: req.body.businessPhone,
        openTime: req.body.openTime,
        businessWebsite: req.body.businessWebsite,
        chargerFor: req.body.chargerFor,
        businessName: req.body.businessName,
        hostPhoto: req.body.hostPhoto,
        password: req.body.password,
      });
      try {
        console.log("----------------------------------------inner try block")
        const data = await host.save();
        res.status(200).json({
          status: true,
          data
        });
      } catch (err) {
        console.log(err);
        res.status(200).json({
          status: false,
          message: "aadhar number already exist......."

        });
      }

    } catch (err) {
      res.status(200).json({
        status: false,
        message: "aadhar number already exist"
      });
    }
  }
];

exports.login = [
  sanitizeBody("email").trim(),
  sanitizeBody("phone").trim(),
  sanitizeBody("password").trim(),
  async (req, res) => {
    try {
      console.log("------------------------outer try block");
      let data = await Host.findOne({
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
        let lastDate = Date.now();
        let lastloginDate = {
          lastActiveAt: lastDate
        };
        let updateData = await Host.findOneAndUpdate({
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
          message: "invalid username or password..."
        });
      }
    } catch (err) {
      console.log(err);
      res.status(203).json({
        status: false,
        message: "invalid username or password"
      });
    }
  }
];

exports.getProfile = async (req, res) => {
  try {
    console.log("view profile called");
    let data = await Host.findOne({
      _id: req.query.hostId
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
  sanitizeBody("hostId").trim(),
  sanitizeBody("firstName").trim(),
  sanitizeBody("lastName").trim(),
  sanitizeBody("email").trim(),
  sanitizeBody("phone").trim(),
  sanitizeBody("city").trim(),
  sanitizeBody("state").trim(),
  sanitizeBody("businessType").trim(),
  sanitizeBody("businessPhoto").trim(),
  sanitizeBody("latitude").trim(),
  sanitizeBody("longitude").trim(),
  sanitizeBody("businessSize").trim(),
  sanitizeBody("businessName").trim(),
  sanitizeBody("businessPhone").trim(),
  sanitizeBody("openTime").trim(),
  sanitizeBody("businessWebsite").trim(),
  sanitizeBody("chargerFor").trim(),

  async (req, res) => {
    console.log("update profile called");
    let updateValue = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      city: req.body.city,
      password: req.body.password,
      email: req.body.email,
      state: req.body.state,
      businessType: req.body.businessType,
      businessPhoto: req.body.businessPhoto,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      businessSize: req.body.businessSize,
      businessPhone: req.body.businessPhone,
      openTime: req.body.openTime,
      businessWebsite: req.body.businessWebsite,
      chargerFor: req.body.chargerFor,
      businessName: req.body.businessName,
      hostPhoto: req.body.hostPhoto
    };
    try {
      let data = await Host.findOneAndUpdate({
        _id: req.body.hostId
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
        message: "Email or mobile number already exsist with another user"
      });
    }
  }
];

exports.hostIssues = [
  sanitizeBody("hostId").trim(),
  sanitizeBody("title").trim(),
  sanitizeBody("description").trim(),
  sanitizeBody("photo").trim(),

  async (req, res) => {
    try {
      console.log("------------------------------------------inside first try block")
      const issues = new Issues({
        hostId: req.body.hostId,
        title: req.body.title,
        photo: req.body.photo,
        description: req.body.description,

      });
      try {
        console.log("----------------------------------------inner try block")
        const data = await issues.save();
        res.status(200).json({
          status: true,
          data
        });
      } catch (err) {
        console.log(err);
        res.status(200).json({
          status: false,
          message: "......."

        });
      }

    } catch (err) {
      res.status(200).json({
        status: false,
        message: "."
      });
    }
  }
];

exports.getAllHostIssues = async (req, res) => {
  try {
    console.log("get all issues called");
    let data = await Issues.findOne({
      hostId: req.query.hostId
    });
    res.status(200).json({
      status: true,
      issuesData: data
    });
  } catch (err) {
    res.status(401).json({
      status: false,
      message: "Issues not found"
    });
  }
};



exports.getChargingPointList = [
  sanitizeBody("hostId").trim(),
  async (req, res) => {
    try {
      var data = await ChargingPorts.find({
        hostId: req.query.hostId
      }).populate(
        "ports"
      );
      if (data) {
        res.status(200).json({
          status: true,
          message: "chargining ports listed successfully",
          charginPoints: data
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Charging ports not listed successfully."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong."
      });
    }
  }
];

exports.showAllHostSessions = [

  sanitizeBody("hostId").trim(),


  async (req, res) => {
    try {
      const showsessions = new showSessionmodel({
        hostId: req.query.hostId,
      });

      try {



        let data = await showSessionmodel.find({
          hostId: req.query.hostId
        }, (error, doc) => {


        });



        res.status(200).json({
          status: true,
          sessionsData: data
        });

      } catch (err) {

        res.status(400).json({
          status: false,
          message: "inside block error"

        });
      }

    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "Cannot create the session, please try again"
      });

    }
  }

];

exports.showAllHostTransactions = [

  sanitizeBody("hostId").trim(),


  async (req, res) => {
    try {
      const showsessions = new showSessionmodel({
        hostId: req.query.hostId,
      });

      try {



        let data = await showSessionmodel.find({
          hostId: req.query.hostId
        }, {
          chargedAmount: 1
        }, (error, doc) => {


        });



        res.status(200).json({
          status: true,
          sessionsData: data
        });

      } catch (err) {

        res.status(400).json({
          status: false,
          message: "inside block error"

        });
      }

    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Cannot create the session, please try again"
      });

    }
  }

];

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

exports.updateStationStatus = [
  sanitizeBody("hostId"),
  sanitizeBody("isOpen"),

  async (req, res) => {
    try {
      console.log("-------------------------------------------inside try block")
      let status = {
        isOpen: req.body.isOpen
      };
      let updateStatus = await ChargingStations.findOneAndUpdate({
        hostId : req.body.hostId
      }, {
        $set: status
      }, {
        new: true
      });
      console.log("-------------------------------------------before if "+ updateStatus)
      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "Station status updated successfully"
        });
      } else {
        res.status(204).json({
          status: false,
          message: "Station status not updated successfully"
        });
      }
      if(req.body.isOpen == "true"){
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++inside if ");
        let portstatus = {
          isOnline : "true"
        };
        let updateStatus = await ChargingPorts.update({
          hostId : req.body.hostId
        }, {
          $set: portstatus
        }, {
          multi: true
        });
      }
      else{
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++inside else ");
        let portstatus = {
          isOnline : "false"
        };
        let updateStatus = await ChargingPorts.update({
          hostId : req.body.hostId
        }, {
          $set: portstatus
        }, {
          multi: true
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

exports.updateSpecificPortStatus = [
  sanitizeBody("hostId"),
  sanitizeBody("isOnline"),
  sanitizeBody("portId"),

  async (req, res) => {
    try {
      console.log("-------------------------------------------inside try block")
      let status = {
        isOnline: req.body.isOnline
      };
      let updateStatus = await ChargingPorts.findOneAndUpdate({
        _id : req.body.portId
      }, {
        $set: status
      }, {
        new: true
      });
      console.log("-------------------------------------------before if "+ updateStatus)
      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "Station status updated successfully"
        });
      } else {
        res.status(204).json({
          status: false,
          message: "Station status not updated successfully"
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