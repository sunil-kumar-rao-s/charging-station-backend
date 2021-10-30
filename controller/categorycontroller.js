const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const Category = require("../schema/categorymodel");
const SubCategory = require("../schema/subcategorymodel");

exports.addMainCategory = [
  sanitizeBody("categoryName").trim(),
  async (req, res) => {
    let category = new Category({
      categoryName: req.body.categoryName
    });
    try {
      let data = await category.save();
      res.status(200).send({
        status: true,
        message: "EV brand added successfully.",
        category: data
      });
    } catch (err) {
      res.status(409).send({
        status: false,
        message: "EV brand already exsist.",
        error: err
      });
    }
  }
];

exports.addSubCategory = [
  sanitizeBody("subCategoryName").trim(),
  sanitizeBody("categoryId").trim(),
  async (req, res) => {
    
    let subCategory = new SubCategory({
      subCategoryName: req.body.subCategoryName,
      categoryId: req.body.categoryId
    });
    try {

      let data = await subCategory.save();

      res.status(200).json({
        status: true,
        message: "EV model added sucessfully.",
        subCategory: data
      });
    } catch (err) {
      res.status(409).json({
        status: false,
        message: "EV model already exsist.",
        error: err
      });
    }
  }
];

exports.getCategoryList = [
  async (req, res) => {
    try {
      let data = await Category.find({});
      res.status(200).send({
        status: true,
        message: "EV brands listed successfully.",
        data
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "something went wrong!!!",
        error: err

      });
    }
  }
];

exports.getSubCategoryList = [
  sanitizeBody("categoryId").trim(),
  async (req, res) => {
    try {
      let subCategoryList = await SubCategory.find({
        categoryId: req.body.categoryId
      });
      res.status(200).json({
        status: true,
        message: "EV models listed successfully",
        subCategory: subCategoryList
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "something went wrong!!!",
        error: err
      });
    }
  }
];