var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const orderController = require('../controller/orderController')

router.get('/', function(req, res, next) {
    res.send('Order routes called');
  });
  
  router.post('/create', orderController.createOrder);
  router.post('/createorderid', orderController.createOrderId);
  module.exports = router;