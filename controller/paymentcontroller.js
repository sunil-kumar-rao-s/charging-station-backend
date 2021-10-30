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
                message: "Coin pack added successfully.",
                pack
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

exports.viewPack = [

    async (req, res) => {
        try {

            const packdata = await CoinpackSchema.find({}, function (err, docs) {
                if (err) {
                    res.status(203).json({
                        status: false,
                        message: "Cannot able to list coin packs.",
                        error: err
                    });

                } else {
                    res.status(200).json({
                        status: true,
                        message: "Coin packs listed successfully.",
                        packdata: docs
                    });
                }
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

exports.deletePack = [
    sanitizeBody("packId").trim(),
    async (req, res) => {
        try {

            const packdata = await CoinpackSchema.deleteOne({
                packId: req.body.packId
            }, function (err, docs) {
                if (err) {
                    res.status(203).json({
                        status: false,
                        message: "Cannot able to delete coin pack.",
                        error: err
                    });

                } else {
                    res.status(200).json({
                        status: true,
                        message: "Coin Pack deleted Successfully",

                    });
                }
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

exports.editPack = [
    sanitizeBody("packId").trim(),
    sanitizeBody("packName").trim(),
    sanitizeBody("packAmount").trim(),
    sanitizeBody("packDiscount").trim(),
    sanitizeBody("isDiscount").trim(),
    sanitizeBody("numberOfCoins").trim(),
    sanitizeBody("description").trim(),
    async (req, res) => {
        try {

            const editpack = {

                packName: req.body.packName,
                packAmount: req.body.packAmount,
                packDiscount: req.body.packDiscount,
                isDiscount: req.body.isDiscount,
                numberOfCoins: req.body.numberOfCoins,
                description: req.body.description,


            };
            let packdata = await CoinpackSchema.findOneAndUpdate({
                packId: req.body.packId
            }, {
                $set: editpack
            }, {
                new: true
            }, function (err, docs) {
                if (err) {
                    res.status(203).json({
                        status: false,
                        message: "Coin pack not found.",
                        err
                    });


                } else {
                    res.status(200).json({
                        status: true,
                        message: "Coin pack updated successfully.",
                        docs
                    });
                }
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