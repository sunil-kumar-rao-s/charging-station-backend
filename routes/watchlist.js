var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const common = require("../common/common");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const watchlistcontroller = require('../controller/watchlist');

router.post('/add',common.checkUser, watchlistcontroller.addWatchList);
router.post('/delete',common.checkUser, watchlistcontroller.deleteWatchlist);
router.post('/getwatchlist',common.checkUser, watchlistcontroller.getWatchList);
module.exports = router;