var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const common = require("../common/common");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const categoryController = require("../controller/categorycontroller");

router.get("/", function(req, res, next) {
  res.send("Category routes called");
});
router.post('/addmaincategory',common.checkAdmin, categoryController.addMainCategory);
router.post('/addsubcategory',common.checkAdmin,categoryController.addSubCategory);
router.get('/categorylist', categoryController.getCategoryList);
router.post('/subcategorylist', categoryController.getSubCategoryList);
module.exports = router;