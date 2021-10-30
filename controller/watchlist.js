const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const Watchlist = require("../schema/watchlist");

exports.addWatchList = [
  sanitizeBody("userId"),
  sanitizeBody("chargingPointId"),
  async (req, res) => {
    try {
      let findDuplicate = await Watchlist.findOne({
        $and: [{
            userId: req.body.userId
          },
          {
            chargingPointId: req.body.chargingPointId
          }
        ]
      });
      if (findDuplicate) {
        res.status(203).json({
          status: false,
          message: "Watchlist already exist."
        });
      } else {
        let watchList = new Watchlist({
          userId: req.body.userId,
          chargingPointId: req.body.chargingPointId
        });
        let data = await watchList.save();
        if (data) {
          res.status(200).json({
            status: true,
            message: "Watchlist added successfully."
          });
        } else {
          res.status(203).json({
            status: false,
            message: "Watchlist not inserted."
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

exports.deleteWatchlist = [
  sanitizeBody("userId"),
  sanitizeBody("chargingPointId"),
  async (req, res) => {
    try {
      let data = await Watchlist.findOneAndDelete({
        $and: [{
            userId: req.body.userId
          },
          {
            chargingPointId: req.body.chargingPointId
          }
        ]
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Watchlist deleted successfully."
        });
      } else {
        res.status(203).json({
          status: false,
          message: "Could not able to delete Watchlist."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

exports.getWatchList = [
  sanitizeBody("userId"),
  async (req, res) => {
    try {
      let watchListData = await Watchlist.find({})
        .populate("chargingPointId")
        .lean()
        .exec();
      if (watchListData) {
        try {
          let data = await checkwatchList(watchListData, req.body.userId);
          res.status(200).json({
            status: true,
            message: "Watchlist listed successfully.",
            watchList: data
          });
        } catch (err) {

          res.status(500).json({
            status: false,
            message: "Something went wrong!!!",
            error: err
          });
        }
      } else {
        res.status(203).json({
          status: false,
          message: "Watchlist record not found."
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err
      });
    }
  }
];

async function checkwatchList(watchListData, userId) {
  let j = 0;
  let newData = [];
  for (i = 0; i < watchListData.length; i++) {
    let isWatchlist = await Watchlist.findOne({
      $and: [{
        _id: watchListData[i]._id
      }, {
        userId: userId
      }]
    });
    if (isWatchlist) {
      watchListData[i].isWatchList = true;
    } else {
      watchListData[i].isWatchList = false;
    }
  }
  return watchListData;
}