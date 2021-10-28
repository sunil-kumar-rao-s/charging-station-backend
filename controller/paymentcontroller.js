const {
    body,
    validationResult
} = require("express-validator");
const {
    sanitizeBody
} = require("express-validator/filter");
const User = require("../schema/usermodal");
const Payment = require("../schema/payment");
const CoinpackSchema = require("../schema/coinpacks");

exports.addPack = [
    sanitizeBody("packName").trim(),
    sanitizeBody("packAmount").trim(),
    sanitizeBody("packDiscount").trim(),
    sanitizeBody("isDiscount").trim(),
    sanitizeBody("numberOfCoins").trim(),
    sanitizeBody("description").trim(),
    async (req, res) => {
        try {

            const packid = await CoinpackSchema.find().count() + 1;
            const pack = new CoinpackSchema({
                packId: packid,
                packName: req.body.packName,
                packAmount: req.body.packAmount,
                packDiscount: req.body.packDiscount,
                isDiscount: req.body.isDiscount,
                numberOfCoins: req.body.numberOfCoins,
                description: req.body.description,


            });

            const packdata = await pack.save();

            res.status(200).json({
                status: true,
                message: "Coin Pack saved Successfully",
                pack
            });



        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Something went Wrong"
            });
        }
    }
];

exports.viewPack = [

    async (req, res) => {
        try {

            const packdata = await CoinpackSchema.find({}, function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Something went Wrong",
                        err
                    });

                } else {
                    res.status(200).json({
                        status: true,
                        message: "Coin Packs listed Successfully",
                        packdata: docs
                    });
                }
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Internal Server Error",
                err
            });
        }
    }
];

exports.deletePack = [
    sanitizeBody("packId").trim(),
    async (req, res) => {
        try {

            const packdata = await CoinpackSchema.deleteOne({packId:req.body.packId}, function (err, docs) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Something went Wrong",
                        err
                    });

                } else {
                    res.status(200).json({
                        status: true,
                        message: "Coin Packs deleted Successfully",
                        
                    });
                }
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: false,
                message: "Internal Server Error",
                err
            });
        }
    }
];