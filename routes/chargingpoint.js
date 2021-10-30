var express = require("express");
var chargingpointController = require("../controller/charginpointcontroller");
const common = require("../common/common");
var router = express.Router();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res, next) => {
  res.send("charging point route called");
});

router.post(
  "/addpoint",
  common.checkAdmin,
  chargingpointController.createChargingPoing
);
router.post(
  "/updatePoint",
  common.checkAdmin,
  chargingpointController.updateChargingPoint
);
router.get("/getpointlist", chargingpointController.getChargingPointList);
router.post(
  "/updatepointstatus",
  common.checkAdmin,
  chargingpointController.changetPointStatus
);
router.post(
  "/deletepointlist",
  common.checkAdmin,
  chargingpointController.deletetPoint
);

router.post(
  "/getnearestchargepoints",
  chargingpointController.getCharginingPointsBylocation
);

router.post(
  "/addport",
  common.checkAdmin,
  chargingpointController.addChargingPort
);

router.post(
  "/getchargingpointsbyid",
  chargingpointController.getChargingPointsById
);

module.exports = router;
