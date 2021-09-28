const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
const { findOneAndUpdate } = require("../schema/usermodal");
const browser = require('browser-detect');
const WebAnalytics = require('../schema/webanalytics');

exports.getDetails = [
 
    async (req, res) => {
      
            console.log("inside controller");
              var IPs = req.headers['x-forwarded-for'] ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress ||
                  req.connection.socket.remoteAddress;
                  console.log(IPs);
                  const result = browser(req.headers['user-agent']);
   
                  console.log(result);
                  
              if (IPs.indexOf(":") !== -1) {
                  console.log("inside if");
                  IPs = IPs.split(":")[IPs.split(":").length - 1]
              }
              try {
                console.log("inside try")
               
                  const ipdetails = new WebAnalytics({
                    ip:IPs,
                    browserName:result.name,
                    browserVersion:result.version,
                    time:Date.now()
                  });
                  console.log(ipdetails);
                  try {
                    const data = await ipdetails.save();
                    res.status(200).json({
                      status: true,
                      data
                    });
                  } catch (err) {
                    console.log(err);
                    res.status(200).json({
                      status: false,
                      message: "."
                    });
                  }
                
              } catch (err) {
                res.status(200).json({
                  status: false,
                  message: "something went wrong"
                });
              }

      }
    
  
  ];