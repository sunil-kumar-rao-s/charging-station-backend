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

router.post("/addadmin",common.checkAdmin, adminController.createAdminUser);
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
router.post('/update/notification',common.checkAdmin, adminController.activateOrdeactivateNotification);
router.post('/dashboard', common.checkAdmin, adminController.dashBoard);
router.post("/updatehostissuestatus", common.checkAdmin, adminController.updateHostIssueStatus);
router.post('/updatehoststatus',common.checkAdmin, adminController.updateHostStatus);
router.post("/gethostlist", common.checkAdmin, adminController.getAllHostList);
router.post("/getwebsitevisitors", common.checkAdmin, adminController.getwebsitevisitors);
router.post("/getemailsubs", common.checkAdmin, adminController.getemailsubs);
router.post("/getappuserlogins", common.checkAdmin, adminController.getAppuserlogins);
router.post("/gethostforms", common.checkAdmin, adminController.gethostform);
router.post("/getinvestorforms", common.checkAdmin, adminController.getinvestorform);
router.post("/getsalt", common.checkAdmin, adminController.getSalt);
router.post("/decryptpass", common.checkAdmin, adminController.decryptPass);
router.post("/encryplainpasswords", common.checkAdmin, adminController.encryUserPassword);
router.post("/addstationimages", common.checkAdmin, adminController.addStationImages);
router.post("/addtimeslot", common.checkAdmin, adminController.addTimeSlot);
router.post("/edittimeslot", common.checkAdmin, adminController.editTimeSlot);
router.post("/deletetimeslot", common.checkAdmin, adminController.deleteTimeSlot);

module.exports = router;
