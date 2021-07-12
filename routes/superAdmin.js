const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const superAdminController = require('../controller/SuperAdminController');

router.get('/',function (req, res) {
    res.send("super admin controller called");
})

router.post('/create', superAdminController.createSuperAdmin);
router.post('/login', superAdminController.superLogin);

module.exports = router;
