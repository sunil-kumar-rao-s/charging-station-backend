const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const Vechicle = require("../schema/vechicle");

exports.addVechicle = [
  sanitizeBody("userId"),
  sanitizeBody("categoryId"),
  sanitizeBody("subCategoryId"),
  sanitizeBody("vechicleNumber"),
  sanitizeBody("vechicleType"),
  async (req, res) => {
    let findDuplicate = await Vechicle.findOne({
      vechicleNumber: req.body.vechicleNumber
    });
    if (findDuplicate) {
      res.status(203).json({
        status: false,
        message: "Vehicle number already exist."
      });
    } else {
      try {
        let vechicle = new Vechicle({
          userId: req.body.userId,
          category: req.body.categoryId,
          subCategory: req.body.subCategoryId,
          vechicleNumber: req.body.vechicleNumber,
          vechicleType: req.body.vechicleType,
        });
        const data = await vechicle.save();
        let vechicleData = await Vechicle.findById({
            _id: data._id
          })
          .populate("category")
          .populate("subCategory")
          .populate("userId", "-password")
          .exec();
        if (data) {
          res.status(200).json({
            status: true,
            message: "Vehicle inserted sucessfully.",
            vechicle: vechicleData
          });
        } else {
          res.status(203).json({
            status: false,
            message: "Vehicle not inserted."
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
  }
];

exports.getVechicleList = [
  sanitizeBody("userId"),
  async (req, res) => {
    try {
      let data = await Vechicle.find({
          userId: req.body.userId
        })
        .populate("category")
        .populate("subCategory")
        .exec();

      if (data) {
        res.status(200).json({
          status: true,
          message: "Vehicles listed successfully.",
          vechicles: data
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Cannot able to list Vechicles."
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

exports.updateVechicleList = [
  sanitizeBody("userId"),
  sanitizeBody("categoryId"),
  sanitizeBody("subCategoryId"),
  sanitizeBody("vechicleNumber"),
  sanitizeBody("vechicleId"),
  sanitizeBody("vechicleType"),
  async (req, res) => {
    let duplicateData = await Vechicle.findOne({
      $and: [{
          vechicleNumber: req.body.vechicleNumber
        },
        {
          _id: {
            $ne: req.body.vechicleId
          }
        }
      ]
    });

    if (duplicateData) {
      res.status(203).json({
        status: false,
        message: "Vehicle Number already exist."
      });
    } else {
      let updatedData = {
        category: req.body.categoryId,
        subCategory: req.body.subCategoryId,
        vechicleNumber: req.body.vechicleNumber,
        vechicleType: req.body.vechicleType
      };
      try {
        let data = await Vechicle.findOneAndUpdate({
            _id: req.body.vechicleId,
            userId: req.body.userId
          }, {
            $set: updatedData
          }, {
            new: true
          })
          .populate("category")
          .populate("subCategory")
          .exec();
        if (data) {
          res.status(200).json({
            status: true,
            message: "Vehicle updated sucessfully.",
            vechicle: data
          });
        } else {
          res.status(203).json({
            status: false,
            message: "Vehicle not updated."
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
  }
];

exports.deleteVechicle = [
  sanitizeBody("vechicleId"),
  sanitizeBody("userId"),
  async (req, res) => {
    try {
      let data = await Vechicle.deleteOne({
        _id: req.body.vechicleId,
        userId: req.body.userId
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Vehicle deleted sucessfully."
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Could not able to delete vehicle."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: true,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];