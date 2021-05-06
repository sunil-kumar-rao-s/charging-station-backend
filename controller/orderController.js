const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator/filter");
const Order = require("../schema/ordermodel");
const Payment = require("../schema/payment");
const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: 'rzp_test_6E8SjivqQhV3be',
    key_secret: 'eiI39u9wq0z1PgCDnWEFwJr4'
  })

exports.createOrder = [
  sanitizeBody("bookingDate"),
  sanitizeBody("userId"),
  sanitizeBody("vechicleId"),
  sanitizeBody("chargingPointId"),
  async (req, res) => {
    try {
      console.log('requested date ===> ', new Date(Number(req.body.bookingDate)))
      let order = new Order({
        bookingDate: new Date(Number(req.body.bookingDate)),
        userId: req.body.userId,
        vechicleId: req.body.vechicleId,
        chargingPointId: req.body.chargingPointId
      });
      let data = await order.save();
      if (data) {
        res.status(200).json({
          status: true,
          message: "Order created successfully",
          order: data
        });
      } else {
        res.status(202).json({
          status: false,
          message: "Order not created successfully"
        });
      }
    } catch (err) {
        console.log(err)
      res.status(500).json({
        status: false,
        message: "Something went wrong"
      });
    }
  }
];

exports.createOrderId = [
  sanitizeBody("amount"),
  sanitizeBody("userId"),
  sanitizeBody("orderType"),
  sanitizeBody("orderId"),
  async (req, res) => {
    let options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: req.body.orderType,
      payment_capture: "1",
      notes:{        
          userId: req.body.userId,
          orderType: req.body.orderType,        
      }
      
    };
    instance.orders.create(options, async function(err, order) {
      if (err) {
        res.status(500).json({
          status: false,
          message: "Something went wrong"
        });
      } else {
        let paymentData = new Payment({
          paymentId: order.id,
          userId: req.body.userId,
          orderType: req.body.orderType,
          amount: req.body.amount,
          orderId: req.body.orderId,
        });
        try{
          let data = await paymentData.save();
          if(data){
            res.status(200).json({
              status: true,
              message: "Order id created successfully",
              orderId: order.id
            });  
          }else {
            res.status(200).json({
              status: false,
              message: "Not able to store orderId",
              paymentId: order.id
            });  
        }
        
        } catch(err){
          console.log(err)
          res.status(500).json({
            status: false,
            message: "Something went wrong"
          });
        }        
      }
    });
  }
];