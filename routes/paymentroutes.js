var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const common = require("../common/common");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const paymentController = require('../controller/paymentcontroller');

router.get('/', function(req, res, next) {
    res.send('payment route called');
  });
  
  router.post('/addcoinpack',common.checkAdmin, paymentController.addPack);
  router.post('/viewcoinpacks', paymentController.viewPack);
  router.post('/deletecoinpack',common.checkAdmin, paymentController.deletePack);
  router.post('/editcoinpack',common.checkAdmin, paymentController.editPack);
  module.exports = router;