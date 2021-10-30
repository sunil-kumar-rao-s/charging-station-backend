var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const common = require("../common/common");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const orderController = require('../controller/orderController')

router.get('/', function(req, res, next) {
    res.send('Order routes called');
  });
  
  router.post('/create',common.checkUser, orderController.createOrder);
  router.post('/createorderid',common.checkUser, orderController.createOrderId);
  module.exports = router;