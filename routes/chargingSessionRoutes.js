var express = require('express');
var router = express.Router();
const common = require("../common/common");
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
console.log("------------------------------------------------------in charging routes");

const chargingSessionController = require('../controller/chargingSessionController');

router.get('/', function(req, res, next) {
    res.send('ChargingSession routes called');
  });
  
  router.post('/start_session', chargingSessionController.startSession);
  router.post('/end_session', chargingSessionController.endSession);
  router.post('/show_my_session', chargingSessionController.showAllUserSessions);
  router.post('/show_allusersessions', common.checkAdmin, chargingSessionController.getAllSessions);
  module.exports = router;