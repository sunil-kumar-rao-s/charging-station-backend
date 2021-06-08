const { sanitizeBody } = require("express-validator/filter");
const SuperAdmin = require('../schema/SuperAdmin');

exports.createSuperAdmin = [
    sanitizeBody('firstName').trim(),
    sanitizeBody('lastName').trim(),
    sanitizeBody('email').trim(),
    sanitizeBody('mobileNo').trim(),
    sanitizeBody('password').trim(),

    async (req, res) => {
        try{
            let checkSuperAdmin = await SuperAdmin.findOne({
                $or: [{ phone: req.body.mobileNo, email: req.body.email }]
            });
            if (checkSuperAdmin){
                res.status(202).json({
                    status: false,
                    message: 'Email id or mobile number already exists'
                })
            }else {
                const superAdmin = new SuperAdmin({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.mobileNo,
                    password: req.body.password
                });
                const data = await superAdmin.save();
                res.status(200).json({
                    status: true,
                    superAdmin: data
                });
            }
        }catch (err){
            res.status(500).json({
                status: false,
                error : err
            })
        }
    }
];
