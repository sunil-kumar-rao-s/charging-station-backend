const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
const { findOneAndUpdate } = require("../schema/usermodal");
const browser = require('browser-detect');
const emailsub = require('../schema/emailsub');
const hostSchema = require('../schema/hostform');
const investorSchema = require('../schema/investorform');

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


exports.emailsub = [
      sanitizeBody("email"),
 
    async (req, res) => {
        try{
            console.log(req.body.email);
            const emaildata = new emailsub({
                email:req.body.email

            });
            console.log(req.body.email);

           let data = await emaildata.save();
            res.status(200).json({
                status: true,
                
              });
        }
        catch{
            res.status(400).json({
                status: false,
               
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
      try{
          console.log(req.body.email);
          const hostdata = new hostSchema({
              email:req.body.email,
              name:req.body.name,
              address:req.body.address,
              city:req.body.city,
              state:req.body.userstate,
              businesstype:req.body.businesstype,
              mobile:req.body.mobile

          });
          console.log(req.body.email);

         let data = await hostdata.save();
          res.status(200).json({
              status: true,
              message: "request submitted successfully"
              
            });
      }
      catch(error){
        console.log(error);
          res.status(400).json({
              status: false,
              message:"Something went wrong, please try again!!!"
             
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
    try{
        console.log(req.body.email);
        const investordata = new investorSchema({
            email:req.body.email,
            name:req.body.name,
            comments:req.body.comments,
           
            mobile:req.body.mobile

        });
        console.log(req.body);

       let data = await investordata.save();
        res.status(200).json({
            status: true,
            message: "request submitted successfully"
            
          });
    }
    catch(error){
      console.log(error);
        res.status(400).json({
            status: false,
            message:"Something went wrong, please try again!!!"
           
          });


    }
  
}

];