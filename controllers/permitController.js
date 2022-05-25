const DB = require("../models/permitModel");
const helper = require("../middleware/helper");

module.exports = {
  all: async (req, res, next) => {
    const permit = await DB.find();
    helper.fMsg(res, 200, "all permit from server", permit);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const permit = await DB.find();
    helper.fMsg(res, 201, "receive your data", permit);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    finder
      ? helper.fMsg(res, 200, "get by id complete", finder)
      : next(new Error("no permit with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      await DB.findByIdAndUpdate(finder._id, req.body);
      const permit = await DB.find();
      helper.fMsg(res, 201, "permit edit complete", permit);
    } else next(new Error("no permit with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      await DB.findByIdAndDelete(finder._id);
      const permit = await DB.find();
      helper.fMsg(res, 201, "permit delete complete", permit);
    } else next(new Error("no permit with that id"));
  },
};
