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

        const data = await host.save();
        res.status(200).json({
          status: true,
          message: "Host added successfully.",
          data: data
        });
      } catch (err) {

        res.status(204).json({
          status: false,
          message: "Cannot able to add the host."

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

exports.login = [
  sanitizeBody("email").trim(),
  sanitizeBody("phone").trim(),
  sanitizeBody("password").trim(),
  async (req, res) => {
    try {
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
        data.lastActiveAt = lastDate;
        res.status(200).json({
          status: true,
          message: "Host login successful.",
          data: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "invalid username or password."
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

exports.getProfile = async (req, res) => {
  try {
    let data = await Host.findOne({
      _id: req.query.hostId
    }).select("-password");
    res.status(200).json({
      status: true,
      message: "Host profile listed successfully.",
      profileData: data
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Something went wrong!!!",
      error: err
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
          message: "Host profile updated successfully.",
          data
        });
      } else {
        res.status(204).json({
          status: true,
          message: "Host not found.",
          data
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

exports.hostIssues = [
  sanitizeBody("hostId").trim(),
  sanitizeBody("title").trim(),
  sanitizeBody("description").trim(),
  sanitizeBody("photo").trim(),

  async (req, res) => {
    try {
      const issues = new Issues({
        hostId: req.body.hostId,
        title: req.body.title,
        photo: req.body.photo,
        description: req.body.description,

      });
      try {
        const data = await issues.save();
        res.status(200).json({
          status: true,
          message: "Host issue added successfully.",
          data
        });
      } catch (err) {
        res.status(204).json({
          status: false,


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

exports.getAllHostIssues = async (req, res) => {
  try {
    let data = await Issues.find({
      hostId: req.query.hostId
    });
    res.status(200).json({
      status: true,
      message: "Host issues listed successfully.",
      issuesData: data
    });
  } catch (err) {
    res.status(401).json({
      status: false,
      message: "Something went wrong!!!",
      error: err
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
      var data1 = await ChargingStations.find({
        hostId: req.query.hostId
      });

      if (data) {
        res.status(200).json({
          status: true,
          message: "Host chargers listed successfully.",
          charginStations: data1,
          charginPoints: data
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Host chargers not listed."
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
          message: "Host sessions listed successfully.",
          sessionsData: data
        });

      } catch (err) {

        res.status(500).json({
          status: false,
          message: "Something went wrong!!!",
          error: err
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

        res.status(500).json({
          status: false,
          message: "Something went wrong!!!",
          error: err

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
        message: "Host dashboard data listed successfully.",
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
        message: "Something went wrong!!!",
        error: err
      });
    }

  }
];

exports.updateStationStatus = [
  sanitizeBody("hostId"),
  sanitizeBody("isOpen"),

  async (req, res) => {
    try {
      let status = {
        isOpen: req.body.isOpen
      };
      let updateStatus = await ChargingStations.findOneAndUpdate({
        hostId: req.body.hostId
      }, {
        $set: status
      }, {
        new: true
      });
      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "Station status updated successfully."
        });
      } else {
        res.status(204).json({
          status: false,
          message: "Station status not updated."
        });
      }
      if (req.body.isOpen == "true") {
        let portstatus = {
          isOnline: "true"
        };
        let updateStatus = await ChargingPorts.update({
          hostId: req.body.hostId
        }, {
          $set: portstatus
        }, {
          multi: true
        });
      } else {
        let portstatus = {
          isOnline: "false"
        };
        let updateStatus = await ChargingPorts.update({
          hostId: req.body.hostId
        }, {
          $set: portstatus
        }, {
          multi: true
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

exports.updateSpecificPortStatus = [
  sanitizeBody("hostId"),
  sanitizeBody("isOnline"),
  sanitizeBody("portId"),

  async (req, res) => {
    try {
      let status = {
        isOnline: req.body.isOnline
      };
      let updateStatus = await ChargingPorts.findOneAndUpdate({
        _id: req.body.portId
      }, {
        $set: status
      }, {
        new: true
      });

      if (updateStatus) {
        res.status(200).json({
          status: true,
          message: "Station status updated successfully."
        });
      } else {
        res.status(204).json({
          status: false,
          message: "Station status not updated."
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