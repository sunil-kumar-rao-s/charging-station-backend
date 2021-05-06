var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const app = express();
const common = require("../common/common");
app.use(bodyParser.urlencoded({ extended: true }));

const adminController = require("../controller/admincontroller");

router.get("/", function(req, res, next) {
  res.send("admin controller called");
});

router.post("/addadmin", adminController.createAdminUser);
router.post("/adminlogin", adminController.login);
router.post("/getuserlist", common.checkAdmin, adminController.getAllUserList);
router.post('/updaterstatus',common.checkAdmin, adminController.updateUserStatus);
router.post('/getallorders',common.checkAdmin,adminController.getOrderList);
router.post('/updateorder', common.checkAdmin, adminController.updateOrder);
router.post('/add/privacy', common.checkAdmin, adminController.addStaticPage);
router.post('/add/terms', common.checkAdmin, adminController.addTermsAndCondition);
router.post('/add/about', common.checkAdmin, adminController.addAboutUs);
router.post('/getstaticpage', common.checkAdmin, adminController.getStaticPage);
router.post('/add/howisitwork',common.checkAdmin, adminController.howisitwork);
router.post('/add/notification',common.checkAdmin, adminController.addNotification);
module.exports = router;
