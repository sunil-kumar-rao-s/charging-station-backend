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

const portModel = require("../schema/charginingport");
const {
  Mongoose
} = require("mongoose");


exports.startSession = [
  sanitizeBody("uid").trim(),
  sanitizeBody("userId").trim(),
  sanitizeBody("startMeterReading").trim(),
  sanitizeBody("hostId").trim(),
  sanitizeBody("timer").trim(),

  async (req, res) => {
    try {
      const sid = Date.now() + req.body.uid + req.body.userId;
      const startSession = new chargingSessionModel({
        uid: req.body.uid,
        userId: req.body.userId,
        startMeterReading: req.body.startMeterReading,
        startTime: Date.now(),
        sessionId: sid,
        hostId: req.body.hostId,
        timer: req.body.timer


      });

      const userData = new userModel({

        currentSessionId: sid

      })

      try {

        const updateValue = {

          currentSessionId: sid
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

        


        res.status(200).json({
          status: true,
          data
        });
      } catch (err) {
       
        res.status(400).json({
          status: false,
          message: "Cannot create the session, please try again.."
        });
      }
      setTimeout(function(){

        let timerValue = {
         isOnline:"true"
        };
        try {
          
          portModel.findOneAndUpdate({
            _id: req.body.uid
          }, {
            isOnline: "true"
          }, (error, doc) => {
  
           
  
          });
         
         
        } catch (err) {
        
        }



      },req.body.timer);

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
      const showsessions = new showSessionmodel({
        userId: req.body.userId,
      });

      try {


        let data = await showSessionmodel.find({
          userId: req.body.userId
        }, (error, doc) => {

          
        });



        res.status(200).json({
          status: true,
          sessionsData: data
        });

      } catch (err) {
       
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



        let data = await showAllSessionmodel.find({}, (error, doc) => {

        });



        res.status(200).json({
          status: true,
          AllsessionsData: data
        });

      } catch (err) {
        
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

exports.getChargerdetails = [

  sanitizeBody("qrId").trim(),


  async (req, res) => {
    try {

      let data = await portModel.findOne(
        {qrId: req.body.qrId});
        
          if(data==null){
            res.status(400).json({
              status: false,
              message: "qrId invalid or not found"
              
          });
          }
          else{
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
