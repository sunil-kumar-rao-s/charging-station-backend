var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const categoryController = require("../controller/categorycontroller");

router.get("/", function(req, res, next) {
  res.send("Category routes called");
});
router.post('/addmaincategory', categoryController.addMainCategory);
router.post('/addsubcategory', categoryController.addSubCategory);
router.get('/categorylist', categoryController.getCategoryList);
router.post('/subcategorylist', categoryController.getSubCategoryList);
module.exports = router;