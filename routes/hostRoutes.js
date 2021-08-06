var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
const hostController = require('../controller/hostcontroller');
const common = require("../common/common");

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/addhost', hostController.createHost);
router.post('/login', hostController.login);
//router.get('/getbookings', hostController.getBookings);
router.get('/getprofile',common.checkHost, hostController.getProfile);
router.post('/updateprofile',common.checkHost, hostController.updateProfile);
router.post('/issues',common.checkHost, hostController.hostIssues);
router.get('/getissues',common.checkHost, hostController.getAllHostIssues);
router.post('/updatespecificportstatus',common.checkHost, hostController.updateSpecificPortStatus);
router.get('/getallports',common.checkHost, hostController.getChargingPointList);
router.get('/showallhostsessions',common.checkHost, hostController.showAllHostSessions);
router.get('/getallhosttransactions',common.checkHost, hostController.showAllHostTransactions); //not being called
router.post('/updatestationstatus',common.checkHost,hostController.updateStationStatus);
module.exports = router;