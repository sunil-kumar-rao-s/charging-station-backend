var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const webanalyticscontroller = require('../controller/webanalytics');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

console.log("inside web router");
router.get('/getdetails',webanalyticscontroller.getDetails);
router.post('/emailsub',webanalyticscontroller.emailsub);
router.post('/hostform',webanalyticscontroller.hostForm);
router.post('/investorform',webanalyticscontroller.investorform);
module.exports = router;