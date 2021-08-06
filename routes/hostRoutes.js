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
router.get('/getprofile', hostController.getProfile);
router.post('/updateprofile', hostController.updateProfile);
router.post('/issues', hostController.hostIssues);
router.get('/getissues', hostController.getAllHostIssues);
router.post('/updatespecificportstatus', hostController.updateSpecificPortStatus);
router.get('/getallports', hostController.getChargingPointList);
router.get('/showallhostsessions', hostController.showAllHostSessions);
router.get('/getallhosttransactions', hostController.showAllHostTransactions); //not being called
router.post('/updatestationstatus',hostController.updateStationStatus);
module.exports = router;