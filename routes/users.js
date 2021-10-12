var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
const useController = require('../controller/usercontroller')
const common = require("../common/common");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/adduser',useController.createUser);
router.post('/login',useController.login);
router.get('/viewprofile', useController.getProfile);
router.post('/updateprofile', useController.updateProfile);
router.post('/changepassword', useController.updatePassword);
router.post('/updatewallet', useController.updateWallet);
router.post('/transcationhistory',useController.getTranscationDetails);
router.post('/getstaticpage',useController.getStaticPage);
router.post('/getnotifications',useController.getNotification);
router.post('/sendotp',useController.sendOtp);
router.post('/otpauth',useController.otpAuth);
router.post('/forgotpassword', useController.forgotPassword);
router.post('/otpvalidateforgetpass',useController.otpAuth2);
router.post('/call',useController.call);



module.exports = router;
