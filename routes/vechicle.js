var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const vechcileController = require("../controller/vechiclecontroller");

router.get("/", function(req, res, next) {
  res.send("Vechicle Route Called");
});

router.post("/addvechicle", vechcileController.addVechicle);
router.post('/getvechiclelist', vechcileController.getVechicleList);
router.post('/updatevechicle', vechcileController.updateVechicleList);
router.post('/deletevechicle', vechcileController.deleteVechicle)
module.exports = router;
