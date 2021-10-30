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

router.post("/addvechicle",common.checkAdmin, vechcileController.addVechicle);
router.post('/getvechiclelist', vechcileController.getVechicleList);
router.post('/updatevechicle',common.checkAdmin, vechcileController.updateVechicleList);
router.post('/deletevechicle',common.checkAdmin, vechcileController.deleteVechicle)
module.exports = router;
