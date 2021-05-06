var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const watchlistcontroller = require('../controller/watchlist');

router.post('/add', watchlistcontroller.addWatchList);
router.post('/delete', watchlistcontroller.deleteWatchlist);
router.post('/getwatchlist', watchlistcontroller.getWatchList);
module.exports = router;