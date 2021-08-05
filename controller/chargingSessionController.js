const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const chargingSessionModel = require("../schema/chargingSession");
const userModel = require("../schema/usermodal");
const showSessionmodel = require("../schema/chargingSession");
const showAllSessionmodel = require("../schema/chargingSession");
const portModel = require("../schema/chargingpointmodel");
const {
  Mongoose
} = require("mongoose");


exports.startSession = [
  sanitizeBody("uid").trim(),
  sanitizeBody("userId").trim(),
  sanitizeBody("startMeterReading").trim(),
  sanitizeBody("hostId").trim(),

  async (req, res) => {
    try {
      console.log("------------------------------------------------------------------------------------------------------in sessionstahfkjgdsahkfgdksgfdsgdrt");

      const sid = Date.now() + req.body.uid + req.body.userId;
      const startSession = new chargingSessionModel({
        uid: req.body.uid,
        userId: req.body.userId,
        startMeterReading: req.body.startMeterReading,
        startTime: Date.now(),
        sessionId: sid,
        hostId: req.body.hostId


      });

      console.log("--------------------------------------------------------------11");
      const userData = new userModel({

        currentSessionId: sid

      })

      try {

        const updateValue = {

          currentSessionId: sid
        };
        const updateValue1 = {

          isOnline: false
        };
        console.log(updateValue);


        userModel.findOneAndUpdate({
          _id: req.body.userId
        }, {
          $set: updateValue
        }, {
          new: true
        }, (error, doc) => {


        });

        const data = await startSession.save();

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
          data
        });
      } catch (err) {
        res.status(400).json({
          status: false,
          message: "Cannot create the session, please try again"
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

exports.endSession = [
  sanitizeBody("uid").trim(),
  sanitizeBody("userId").trim(),
  sanitizeBody("sessionId").trim(),
  sanitizeBody("endMeterReading").trim(),
  sanitizeBody("consumption").trim(),
  

  async (req, res) => {
    try {
      console.log("------------------------------------------------------------------------------------------------------in end session");


      const endSession = new chargingSessionModel({
        // uid: req.body.uid,
        // userId: req.body.userId,
        endMeterReading: req.body.endMeterReading,
        endTime: Date.now(),
        //sessionId: req.body.sessionId,
        consumption: req.body.consumption,
        chargedAmount: req.body.consumption * 10,
        isSessionActive: "False"


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
            endTime: Date.now()
          }
        }, {
          upsert: true
        }, (error, doc) => {
          console.log("--------------------------------------------111111111111111111111111111111" + endSession);

        });

        console.log("-----------------------------------------22");
        const updateValue1 = {

          isOnline: true
        };


        portModel.findOneAndUpdate({
          _id: req.body.uid
        }, {
          $set: updateValue1
        }, {
          new: true
        }, (error, doc) => {

          console.log("-----------------------------------------22" + doc);
        });
        

        res.status(200).json({
          status: true,

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
      const showsessions = new showSessionmodel({
        userId: req.body.userId,
      });

      try {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++inside inner try block");


        let data = await showSessionmodel.find({
          userId: req.body.userId
        }, (error, doc) => {

          console.log("-----------------------------------------22" + doc);
          console.log("---------------------------------------3--22" + error);
        });



        res.status(200).json({
          status: true,
          sessionsData: data
        });

      } catch (err) {
        console.log("11111111111111111111111111111111111111111111111111111111111111111111" + err);
        res.status(400).json({
          status: false,
          message: "inside block error"

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

exports.getAllSessions = [

  sanitizeBody("adminId").trim(),


  async (req, res) => {
    try {
     

      try {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++inside inner try block");


        let data = await showAllSessionmodel.find({}, (error, doc) => {

          console.log("-----------------------------------------22" + doc);
          console.log("---------------------------------------3--22" + error);
        });



        res.status(200).json({
          status: true,
          AllsessionsData: data
        });

      } catch (err) {
        console.log("11111111111111111111111111111111111111111111111111111111111111111111" + err);
        res.status(400).json({
          status: false,
          message: "inside block error"

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