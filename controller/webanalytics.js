const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
const { findOneAndUpdate } = require("../schema/usermodal");

exports.getDetails = [
 
    async (req, res) => {
      
          try {
              var IPs = req.headers['x-forwarded-for'] ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress ||
                  req.connection.socket.remoteAddress;
                  console.log(IPs);
                  const result = browser(req.headers['user-agent']);
   
                  console.log(result);
                  
              if (IPs.indexOf(":") !== -1) {
                  IPs = IPs.split(":")[IPs.split(":").length - 1]
              }
              let updateValue = {
                ip: IPs,
                browserName: result,
                browserVersion:result

            };
             
              let ip = await findOneAndUpdate(
                  {ip:req.body.ip},
                  {$set:updateValue},
                  {
                    new: true
                  });
              
              return res.json({ IP: IPs.split(",")[0] });
          } catch (err) {
              return res.json({ message: 'got error' });
          }
      }
    
  
  ];