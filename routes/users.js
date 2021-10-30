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
router.post('/updateprofile',common.checkUser, useController.updateProfile);
router.post('/changepassword',common.checkUser, useController.updatePassword);
router.post('/updatewallet',common.checkUser, useController.updateWallet);
router.post('/transcationhistory',common.checkUser,useController.getTranscationDetails);
router.post('/getstaticpage',useController.getStaticPage);
router.post('/getnotifications',useController.getNotification);
router.post('/sendotp',common.checkUser,useController.sendOtp);
router.post('/otpauth',common.checkUser,useController.otpAuth);
router.post('/forgotpassword',common.checkUser, useController.forgotPassword);
router.post('/otpvalidateforgetpass',common.checkUser,useController.otpAuth2);





module.exports = router;
