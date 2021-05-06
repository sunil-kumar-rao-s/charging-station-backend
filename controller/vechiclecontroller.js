const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
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
      res.status(500).json({
        status: false,
        message: "Vechicle Number already exsist"
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
        let vechicleData = await Vechicle.findById({ _id: data._id })
          .populate("category")
          .populate("subCategory")
          .populate("userId", "-password")
          .exec();
        if (data) {
          res.status(200).json({
            status: true,
            message: "Vechicle Inserted Sucessfully",
            vechicle: vechicleData
          });
        } else {
          res.status(500).json({
            status: false,
            message: "Vechicle not Inserted Sucessfully"
          });
        }
      } catch (err) {
        res.status(500).json({
          status: false,
          message: "Vechicle Number already exsisit"
        });
      }
    }
  }
];

exports.getVechicleList = [
  sanitizeBody("userId"),
  async (req, res) => {
    try {
      let data = await Vechicle.find({ userId: req.body.userId })
        .populate("category")
        .populate("subCategory")
        .exec();

      if (data) {
        res.status(200).json({
          status: true,
          message: "Vechicle list populated successfully",
          vechicles: data
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Vechicle list not populated successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Vechicle list not populated successfully"
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
      $and: [
        { vechicleNumber: req.body.vechicleNumber },
        { _id: { $ne: req.body.vechicleId } }
      ]
    });

    if (duplicateData) {
      res.status(409).json({
        status: false,
        message: "Vechicle Number already exsist"
      });
    } else {
      let updatedData = {
        category: req.body.categoryId,
        subCategory: req.body.subCategoryId,
        vechicleNumber: req.body.vechicleNumber,
        vechicleType: req.body.vechicleType
      };
      try {
        let data = await Vechicle.findOneAndUpdate(
          { _id: req.body.vechicleId, userId: req.body.userId },
          { $set: updatedData },
          { new: true }
        )
          .populate("category")
          .populate("subCategory")
          .exec();
        if (data) {
          res.status(200).json({
            status: true,
            message: "vechicle updated sucessfully",
            vechicle: data
          });
        } else {
          res.status(400).json({
            status: false,
            message: "vechicle not updated sucessfully"
          });
        }
      } catch (err) {
        console.log("update error===> ", err);
        res.status(500).json({
          status: false,
          message: "Something went wrong. Please try again later"
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
      console.log("vechile delete status====> ", data);
      if (data) {
        res.status(200).json({
          status: true,
          message: "Vechicle deleted sucessfully"
        });
      } else {
        res.status(400).json({
          status: true,
          message: "Vechicle not deleted sucessfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: true,
        message: "Vechicle not deleted sucessfully"
      });
    }
  }
];
