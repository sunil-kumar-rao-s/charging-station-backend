const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const chargingPoints = require("../schema/chargingpointmodel");
const charginingPorts = require("../schema/charginingport");

exports.addChargingPort = [
  sanitizeBody('chargingstationId').trim(),
  
  sanitizeBody('chargerType').trim(),
  sanitizeBody('maxChargingSpeed').trim(),
  sanitizeBody("hostId").trim(),
  sanitizeBody('description').trim(),
  sanitizeBody("isOnline").trim(),
  sanitizeBody("qrId").trim(),
  async (req, res) => {
    const ports = new charginingPorts({
      chargingstationId: req.body.chargingstationId,
      qrId: req.body.qrId,
      chargerType: req.body.chargerType,
      maxChargingSpeed: req.body.maxChargingSpeed,
      hostId: req.body.hostId,
      description: req.body.description,
      isOnline: req.body.isOnline,
    });
    try {
      let data = await ports.save();
      if (data) {
        console.log('Charging Ports', data);
        let chargingStation = await chargingPoints.findOneAndUpdate({
          _id: req.body.chargingstationId
        }, {
          $push: {
            port: data._id
          }
        });
        if (chargingStation) {
          res.status(200).json({
            status: true,
            message: 'chargining port created successfully'
          })
        } else {
          res.status(200).json({
            status: false,
            message: 'Charging port not not created successfully',
          })
        }
      } else {
        res.status(200).json({
          status: false,
          message: 'Charginig ports not created successfully',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: 'SOmething went wrong',
      });
    }
  }
]

exports.createChargingPoing = [
  
  sanitizeBody("latitude").trim(),
  sanitizeBody("longitude").trim(),
  sanitizeBody("pointName").trim(),
  sanitizeBody("landMark").trim(),
  sanitizeBody("address").trim(),
  sanitizeBody("isOpen").trim(),
  sanitizeBody("hostId").trim(),
  sanitizeBody("businessType").trim(),
  sanitizeBody("businessName").trim(),
  sanitizeBody("businessDescription").trim(),
  sanitizeBody("portCount").trim(),
  async (req, res) => {
    let location = {
      type: "Point",
      coordinates: [req.body.longitude, req.body.latitude]
    };
    const chargingPoint = new chargingPoints({
      
      pointName: req.body.pointName,
      landMark: req.body.landMark,
      address: req.body.address,
      businessType: req.body.businessType,
      businessName: req.body.address,
      businessDescription: req.body.businessDescription,
      isOpen: req.body.isOpen,
      location: location,
      hostId: req.body.hostId,
      portCount: req.body.portCount,
    });

    try {
      let findData = await chargingPoints.findOne({
        pointName: req.body.pointName
      });
      if (findData) {
        res.status(200).json({
          status: false,
          message: "charging station name is already in use"
        });
      } else {
        let data = await chargingPoint.save();
        if (data) {
          res.status(200).json({
            status: true,
            message: "Charging station added sucessfully",
            charginPoint: data
          });
        } else {
          res.status(500).json({
            status: false,
            message: "Something went wrong. Please try again later"
          });
        }
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({
        status: false,
        message: "Something went wrong. Please try again later"
      });
    }
  }
];

exports.updateChargingPoint = [
  sanitizeBody("pointName").trim(),
  sanitizeBody("portCount").trim(),
  sanitizeBody("landMark").trim(),
  sanitizeBody("address").trim(),
  sanitizeBody("isOpen").trim(),
  sanitizeBody("businessType").trim(),
  sanitizeBody("businessName").trim(),
  sanitizeBody("businessDescription").trim(),
  sanitizeBody("latitude").trim(),
  sanitizeBody("longitude").trim(),
  sanitizeBody("adminId").trim(),
  sanitizeBody("chargingPointId").trim(),
  sanitizeBody("hostId").trim(),
  async (req, res) => {
    let location = {
      type: "Point",
      coordinates: [req.body.longitude, req.body.latitude]
    };
    try {
      let updateData = {
        pointName: req.body.pointName,
        portCount: req.body.portCount,
        landMark: req.body.landMark,
        address: req.body.address,
        pricePerHour: req.body.pricePerHour,
        location: location,
        hostId: req.body.hostId
      };
      let data = await chargingPoints.findOneAndUpdate({
        _id: req.body.chargingPointId
      }, {
        $set: updateData
      }, {
        new: true
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Charging point updated successfully.",
          charginPoint: data
        });
      } else {
        res.status(500).json({
          status: false,
          charginPoint: data
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Charging point not updated successfully."
      });
    }
  }
];

exports.getChargingPointList = [
 /// sanitizeBody("chargingPointId").trim(),
  async (req, res) => {
    try {
      console.log("--------------------+++++++++++++++++++++++++++++++");
      var data = await chargingPoints.find({}).populate(
        "port"
      );
      console.log("--------------------"+ data);
      if (data) {
        res.status(200).json({
          status: true,
          message: "chargining points listed successfully",
          charginPoint: data
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Charging point not updated successfully."
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

exports.changetPointStatus = [
  sanitizeBody("chargingPointId").trim(),
  sanitizeBody("status").trim(),
  sanitizeBody("adminId").trim(),
  async (req, res) => {
    try {
      let data = await chargingPoints.findOneAndUpdate({
        _id: req.body.chargingPointId
      }, {
        $set: {
          isOnline: req.body.status
        }
      }, {
        new: true
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Chargeing point status update successfully",
          charginPoint: data
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Charging point status not updated successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Charging point status not updated successfully"
      });
    }
  }
];

exports.deletetPoint = [
  sanitizeBody("chargingPointId").trim(),
  sanitizeBody("adminId").trim(),
  async (req, res) => {
    try {
      let data = await chargingPoints.deleteOne({
        _id: req.body.chargingPointId
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Chargeing point deleted sucessfully"
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Chargeing point not deleted sucessfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Chargeing point not deleted sucessfully"
      });
    }
  }
];

exports.getCharginingPointsBylocation = [
  sanitizeBody('lat'),
  sanitizeBody('lang'),
  async (req, res) => {
    try {
      let data = await chargingPoints.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [req.body.lang, req.body.lat]
            }
          }
        }
      }).populate(
        "port"
      );
      if (data) {
        res.status(200).json({
          status: true,
          message: 'Chargining point listed sucessfully',
          charginPoint: data,
        })
      } else {
        res.status(200).json({
          status: false,
          message: 'Chargining point not listed sucessfully'
        })
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Something went wrong',
      })
    }
  }
]