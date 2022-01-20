var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const common = require("../common/common");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const vechcileController = require("../controller/vechiclecontroller");

router.get("/", function(req, res, next) {
  res.send("Vechicle Route Called");
});

router.post("/addvechicle",common.checkUser, vechcileController.addVechicle);
router.post('/getvechiclelist',common.checkUser, vechcileController.getVechicleList);
router.post('/updatevechicle',common.checkUser, vechcileController.updateVechicleList);
router.post('/deletevechicle',common.checkUser, vechcileController.deleteVechicle);
module.exports = router;
