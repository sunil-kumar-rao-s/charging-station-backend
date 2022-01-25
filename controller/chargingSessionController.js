const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const chargingSessionModel = require("../schema/chargingSession");
const userModel = require("../schema/usermodal");

const portModel = require("../schema/charginingport");
const timeslotModel = require("../schema/timeslots");
const {
  Mongoose
} = require("mongoose");


exports.startSession = [
  sanitizeBody("uid").trim(),
  sanitizeBody("userId").trim(),
  sanitizeBody("startMeterReading").trim(),
  sanitizeBody("hostId").trim(),
  sanitizeBody("timelslotid").trim(),

  async (req, res) => {
    try {
      const sid = Date.now() + req.body.uid + req.body.userId;
      const timeslotvalue = await timeslotModel.findById({
        _id: req.body.timeslotid
      });
      const startSession = new chargingSessionModel({
        uid: req.body.uid,
        userId: req.body.userId,
        startMeterReading: req.body.startMeterReading,
        startTime: Date.now(),
        sessionId: sid,
        hostId: req.body.hostId,
        timeslotid: req.body.timeslotid,
        chargedAmount: timeslotvalue.price
      });



      const userwallet = await userModel.findById({
        _id: req.body.userId
      });

      const updateValue = {
        currentSessionId: sid,
        walletAmount: userwallet.walletAmount - timeslotvalue.price,
        isSessionActive:"true"
      };
      const updateValue1 = {
        isOnline: "false"
      };

      portModel.findOneAndUpdate({
        _id: req.body.uid
      }, {
        $set: updateValue1
      }, (error, doc) => {

      });

      userModel.findOneAndUpdate({
        _id: req.body.userId
      }, {
        $set: updateValue
      }, {
        new: true
      }, (error, doc) => {


      });

      const data = await startSession.save();



      setTimeout(function () {
        portModel.findOneAndUpdate({
          _id: req.body.uid
        }, {
          isOnline: "true"
        }, function (err, docs) {

        });
        chargingSessionModel.findOneAndUpdate({
          sessionId: sid
        }, {
          $set: {
            isSessionActive: "false"
          }
        }, function (err, docs) {

        });

        userModel.findOneAndUpdate({
          _id: req.body.userId
        }, {
          $set: {
            isSessionActive: "false"
          }
        }, function (err, docs) {

        });

      }, timeslotvalue.time * 60 * 60 * 1000);

      res.status(200).json({
        status: true,
        sessionId: sid,
        timeinseconds:timeslotvalue.time * 60 * 60 
      });


    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Cannot create the session, please try again"
      });

    }
  }

];

exports.endSession = [
  sanitizeBody("uid").trim(),
  sanitizeBody("userId").trim(),
  sanitizeBody("sessionId").trim(),
  sanitizeBody("endMeterReading").trim(),
  sanitizeBody("consumption").trim(),
  sanitizeBody("ratings").trim(),
  sanitizeBody("reviews").trim(),


  async (req, res) => {
    try {


      const endSession = new chargingSessionModel({
        // uid: req.body.uid,
        // userId: req.body.userId,
        endMeterReading: req.body.endMeterReading,
        endTime: Date.now(),
        //sessionId: req.body.sessionId,
        consumption: req.body.consumption,
        chargedAmount: req.body.consumption * 10,
        isSessionActive: "False",
        ratings: req.body.ratings,
        reviews: req.body.reviews,
      });


      try {

        chargingSessionModel.findOneAndUpdate({
          sessionId: req.body.sessionId
        }, {
          $set: {
            endMeterReading: req.body.endMeterReading,
            consumption: req.body.consumption,
            chargedAmount: req.body.consumption * 10,
            isSessionActive: "False",
            endTime: Date.now(),
            ratings: req.body.ratings,
            reviews: req.body.reviews,
          }
        }, {
          upsert: true
        }, (error, doc) => {


        });


        const updateValue1 = {

          isOnline: 'true'
        };


        portModel.findOneAndUpdate({
          _id: req.body.uid
        }, {
          $set: updateValue1
        }, {
          new: true
        }, (error, doc) => {


        });


        res.status(200).json({
          status: true,
          message: "session ended successfully"

        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: err
        });
      }

    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Cannot create the session, please try again"
      });

    }
  }

];



exports.showAllUserSessions = [

  sanitizeBody("userId").trim(),
  async (req, res) => {
    try {

      let data = await chargingSessionModel.find({
        userId: req.body.userId
      }, (error, doc) => {

        if (error) {
          res.status(203).json({
            status: false,
            message: "No sessions found for this user"

          });
        } else {
          res.status(200).json({
            status: true,
            message: "Charging sessions listed successfully",
            sessionsData: doc
          });
        }

      });

    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "Internal server error!!!"
      });

    }
  }

];

exports.getAllSessions = [
  sanitizeBody("adminId").trim(),
  async (req, res) => {
    try {
      let data = await chargingSessionModel.find({}, (error, doc) => {

        if (error) {
          res.status(203).json({
            status: false,
            message: "No sessions found!!!"
          });
        } else {
          res.status(200).json({
            status: true,
            message: "Sessions listed successfully",
            AllsessionsData: doc
          });
        }

      });

    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Internal server error!!!"
      });

    }
  }

];

exports.getChargerdetails = [

  sanitizeBody("qrId").trim(),


  async (req, res) => {
    try {

      let data = await portModel.findOne({
        qrId: req.body.qrId
      });

      if (data == null) {
        res.status(400).json({
          status: false,
          message: "qrId invalid or not found"

        });
      } else {
        res.status(200).json({
          status: true,
          message: "success",
          data

        });
      }





    } catch (err) {

      res.status(400).json({
        status: false,
        message: "Something went wrong, please check again"
      });

    }
  }

];

exports.showSessionbyId = [

  sanitizeBody("sessionId").trim(),
  async (req, res) => {
    try {

      let data = await chargingSessionModel.find({
        sessionId: req.body.sessionId
      }, (error, doc) => {

        if (error) {
          res.status(203).json({
            status: false,
            message: "No sessions found for this ID"

          });
        } else {          
          res.status(200).json({
            status: true,
            message: "Charging session listed successfully",
            sessionsData: doc
          });
        }

      });

    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Internal server error!!!"
      });

    }
  }

];