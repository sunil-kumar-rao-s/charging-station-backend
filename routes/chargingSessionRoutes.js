var express = require('express');
var router = express.Router();
const common = require("../common/common");
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))


const chargingSessionController = require('../controller/chargingSessionController');

router.get('/', function(req, res, next) {
    res.send('ChargingSession routes called');
  });
  
  router.post('/start_session',common.checkUser, chargingSessionController.startSession);
  router.post('/end_session',common.checkUser, chargingSessionController.endSession);
  router.post('/show_my_session',common.checkUser, chargingSessionController.showAllUserSessions);
  router.post('/show_allusersessions', common.checkAdmin, chargingSessionController.getAllSessions);
  router.post('/getchargerdetails',common.checkUser,chargingSessionController.getChargerdetails);
  router.post('/showsessionbyid',chargingSessionController.showSessionbyId);
  module.exports = router;