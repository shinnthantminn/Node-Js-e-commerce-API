const DB = require("../models/DeliverModels");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const delivery = await DB.find();
    helper.fMsg(res, 200, "all delivery service from server", delivery);
  },
  add: async (req, res, next) => {
    req.body.remark = req.body.remark.split(",");
    await new DB(req.body).save();
    const delivery = await DB.find();
    helper.fMsg(res, 201, "add delivery service to server", delivery);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    finder
      ? helper.fMsg(res, 200, "get single delivery by id", finder)
      : next(new Error("no delivery service with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      if (req.body.image) {
        fs.unlinkSync(`./upload/deliveryService/${finder.image}`);
      }
      if (req.body.remark) {
        req.body.remark = req.body.remark.split(",");
      }
      await DB.findByIdAndUpdate(finder._id, req.body);
      const delivery = await DB.find();
      helper.fMsg(res, 201, "edit delivery service to server", delivery);
    } else next(new Error("no delivery service with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      fs.unlinkSync(`./upload/deliveryService/${finder.image}`);
      await DB.findByIdAndDelete(finder._id);
      const delivery = await DB.find();
      helper.fMsg(res, 201, "delete delivery service from server", delivery);
    } else next(new Error("no delivery service with that id"));
  },
};
