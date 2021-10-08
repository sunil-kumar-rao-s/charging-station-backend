const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
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
        message: "Main category inserted successfully",
        category: data
      });
    } catch (err) {
      res.status(409).send({
        status: false,
        message: "category name already exsist"
      });
    }
  }
];

exports.addSubCategory = [
  sanitizeBody("subCategoryName").trim(),
  sanitizeBody("categoryId").trim(),
  async (req, res) => {
      console.log('step one called')
    let subCategory = new SubCategory({
      subCategoryName: req.body.subCategoryName,
      categoryId: req.body.categoryId
    });
    try {
        console.log('step two called')
      let data = await subCategory.save();
      console.log('step three called ',data)
      res.status(200).json({
        status: true,
        message: "subcategory added sucessfully",
        subCategory: data
      });
    } catch (err) {
      res.status(409).json({
        status: true,
        message: "subcategory name already exsist",
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
        message: "category listed successfully",
        data
      });
    } catch (err) {
      res.status(500).send({
        status: false,
        message: "something went wrong please try again later",
        data
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
        message: "subcategory listed successfully",
        subCategory: subCategoryList
      });
    } catch (err) {
        res.status(500).json({
        status: false,
        message: "something went wrong. please try again later"
      });
    }
  }
];
