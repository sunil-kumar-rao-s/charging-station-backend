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
  
  sanitizeBody('chargerSpecs').trim(),
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
      chargerSpecs:req.body.chargerSpecs,
      
    });
    try {
      let data = await ports.save();
      if (data) {
        
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
            message: 'Chargining port added successfully.'
          })
        } else {
          res.status(203).json({
            status: false,
            message: 'Charging station not found.',
          })
        }
      } else {
        res.status(203).json({
          status: false,
          message: 'Charginig ports not created.',
        });
      }
    } catch (err) {
      
      res.status(500).json({
        status: false,
        message: 'Something went wrong!!!',
        error:err
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
  sanitizeBody('chargerSpecs').trim(),
  sanitizeBody('chargerType').trim(),
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
      chargerSpecs:req.body.chargerSpecs,
      chargerType:req.body.chargerType,
    });

    try {
      let findData = await chargingPoints.findOne({
        pointName: req.body.pointName
      });
      if (findData) {
        res.status(203).json({
          status: false,
          message: "Charging station name is already in use."
        });
      } else {
        let data = await chargingPoint.save();
        if (data) {
          res.status(200).json({
            status: true,
            message: "Charging station added sucessfully.",
            charginPoint: data
          });
        } else {
          res.status(203).json({
            status: false,
            message: "Cannot able to create charging station."
          });
        }
      }
    } catch (err) {
      
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error:err
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
        hostId: req.body.hostId,
        chargerSpecs:req.body.chargerSpecs,
        chargerType:req.body.chargerType,
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
          message: "Charging station updated successfully.",
          charginPoint: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to update charging station.",
          
        });
      }
    } catch (err) {
      
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error:err
      });
    }
  }
];

exports.getChargingPointList = [
 /// sanitizeBody("chargingPointId").trim(),
  async (req, res) => {
    try {
      
      var data = await chargingPoints.find({}).populate(
        "port"
      );
     
      if (data) {
        res.status(200).json({
          status: true,
          message: "chargining stations listed successfully.",
          charginPoint: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to list charging station."
        });
      }
    } catch (err) {
      
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error:err
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
          message: "Charging station status updated successfully.",
          charginPoint: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to update charging station status."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error:err
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
          message: "Charging station deleted sucessfully."
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to delete charging station."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error:err
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
          message: 'Chargining stations listed sucessfully',
          charginPoint: data,
        })
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to list charging stations."
        })
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: 'Something went wrong!!!',
        error:err
      })
    }
  }
]