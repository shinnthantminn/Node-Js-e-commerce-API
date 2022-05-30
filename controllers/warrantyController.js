const DB = require("../models/warrantyModel");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const all = await DB.find();
    helper.fMsg(res, 200, "all warranty from server", all);
  },
  add: async (req, res, next) => {
    req.body.remark = req.body.remark.split(",");
    await new DB(req.body).save();
    const all = await DB.find();
    helper.fMsg(res, 201, "add warranty to server", all);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    finder
      ? helper.fMsg(res, 200, "get single warranty by id", finder)
      : next(new Error("no warranty with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      if (req.body.image) {
        fs.unlinkSync(`./upload/warranty/${finder.image}`);
      }
      if (req.body.remark) {
        req.body.remark = req.body.remark.split(",");
      }
      await DB.findByIdAndUpdate(finder._id, req.body);
      const all = await DB.find();
      helper.fMsg(res, 201, "edit warranty to server", all);
    } else next(new Error("no warranty with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      fs.unlinkSync(`./upload/warranty/${finder.image}`);
      await DB.findByIdAndDelete(finder._id);
      const all = await DB.find();
      helper.fMsg(res, 201, "drop warranty to server", all);
    } else next(new Error("no warranty with that id"));
  },
};
