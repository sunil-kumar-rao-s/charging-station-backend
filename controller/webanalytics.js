const {
  body,
  validationResult
} = require("express-validator");
const {
  sanitizeBody
} = require("express-validator/filter");
const {
  findOneAndUpdate
} = require("../schema/usermodal");
const browser = require('browser-detect');
const emailsub = require('../schema/emailsub');
const hostSchema = require('../schema/hostform');
const investorSchema = require('../schema/investorform');
const WebAnalytics = require('../schema/webanalytics');

exports.getDetails = [

  async (req, res) => {

    var IPs = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const result = browser(req.headers['user-agent']);
    if (IPs.indexOf(":") !== -1) {
      IPs = IPs.split(":")[IPs.split(":").length - 1]
    }
    try {
      const ipdetails = new WebAnalytics({
        ip: IPs,
        browserName: result.name,
        browserVersion: result.version,
        time: Date.now()
      });
      try {
        const data = await ipdetails.save();
        res.status(500).json({

        });
      } catch (err) {
        res.status(500).json({

        });
      }

    } catch (err) {
      res.status(500).json({

      });
    }

  }


];


exports.emailsub = [
  sanitizeBody("email"),

  async (req, res) => {
    try {
      const emaildata = new emailsub({
        email: req.body.email
      });
      let data = await emaildata.save();
      res.status(200).json({
        status: true,
        message: "Successfully subscribed"

      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err

      });
    }

  }

];

exports.hostForm = [
  sanitizeBody("email"),
  sanitizeBody("name"),
  sanitizeBody("address"),
  sanitizeBody("city"),
  sanitizeBody("userstate"),
  sanitizeBody("businesstype"),
  sanitizeBody("mobile"),

  async (req, res) => {
    try {
      const hostdata = new hostSchema({
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.userstate,
        businesstype: req.body.businesstype,
        mobile: req.body.mobile

      });
      let data = await hostdata.save();
      res.status(200).json({
        status: true,
        message: "Request submitted successfully."

      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err

      });


    }

  }

];

exports.investorform = [
  sanitizeBody("email"),
  sanitizeBody("name"),
  sanitizeBody("comments"),
  sanitizeBody("mobile"),


  async (req, res) => {
    try {
      const investordata = new investorSchema({
        email: req.body.email,
        name: req.body.name,
        comments: req.body.comments,

        mobile: req.body.mobile

      });

      let data = await investordata.save();
      res.status(200).json({
        status: true,
        message: "Request submitted successfully."

      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong!!!",
        error: err

      });


    }

  }

];