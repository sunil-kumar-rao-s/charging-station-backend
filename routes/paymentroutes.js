var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const paymentController = require('../controller/paymentcontroller');

router.get('/', function(req, res, next) {
    res.send('payment route called');
  });
  
  router.post('/addcoinpack', paymentController.addPack);
  router.post('/viewcoinpacks', paymentController.viewPack);
  router.post('/deletecoinpack', paymentController.deletePack);
  module.exports = router;