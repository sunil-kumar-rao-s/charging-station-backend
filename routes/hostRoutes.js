var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
const hostController = require('../controller/hostcontroller');
const common = require("../common/common");

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/addhost',common.checkAdmin, hostController.createHost);
router.post('/login', hostController.login);
//router.get('/getbookings', hostController.getBookings);
router.get('/getprofile',common.checkHost, hostController.getProfile);
router.post('/updateprofile',common.postcheckHost, hostController.updateProfile);
router.post('/issues',common.postcheckHost, hostController.hostIssues);
router.get('/getissues',common.checkHost, hostController.getAllHostIssues);
router.post('/updatespecificportstatus',common.postcheckHost, hostController.updateSpecificPortStatus);
router.get('/getallports',common.checkHost, hostController.getChargingPointList);
router.get('/showallhostsessions',common.checkHost, hostController.showAllHostSessions);
router.get('/getallhosttransactions',common.checkHost, hostController.showAllHostTransactions); //not being called
router.post('/updatestationstatus',common.postcheckHost,hostController.updateStationStatus);
module.exports = router;