const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
const Watchlist = require("../schema/watchlist");

exports.addWatchList = [
  sanitizeBody("userId"),
  sanitizeBody("chargingPointId"),
  async (req, res) => {
    try {
      let findDuplicate = await Watchlist.findOne({
        $and: [
          { userId: req.body.userId },
          { chargingPointId: req.body.chargingPointId }
        ]
      });
      if (findDuplicate) {
        res.status(404).json({
          status: false,
          message: "Watchlist already added"
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
            message: "Watchlist added successfully"
          });
        } else {
          res.status(204).json({
            status: false,
            message: "Watchlist not inserted successfully"
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong"
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
        $and: [
          { userId: req.body.userId },
          { chargingPointId: req.body.chargingPointId }
        ]
      });
      if (data) {
        res.status(200).json({
          status: true,
          message: "Particular watchlist deleted successfully"
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Particular watchlist not deleted successfully"
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went werong"
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
            message: "watchlist listed successfully",
            watchList: data
          });
        } catch (err) {
          console.log("first---> ", err);
          res.status(500).json({
            status: false,
            message: "Something went werong"
          });
        }
      } else {
        res.status(200).json({
          status: 200,
          message: "Watchlist record not found"
        });
      }
    } catch (err) {
      console.log("last---> ", err);
      res.status(500).json({
        status: false,
        message: "Something went werong"
      });
    }
  }
];

async function checkwatchList(watchListData, userId) {
  let j = 0;
  let newData = [];
  console.log(watchListData);
  for (i = 0; i < watchListData.length; i++) {
    let isWatchlist = await Watchlist.findOne({
      $and: [{ _id: watchListData[i]._id }, { userId: userId }]
    });
    if (isWatchlist) {
      watchListData[i].isWatchList = true;
    } else {
      watchListData[i].isWatchList = false;
    }
  }
  return watchListData;
}
