const DB = require("../models/TagModel");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const tag = await DB.find();
    helper.fMsg(res, 200, "all tags from server", tag);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const tag = await DB.find();
    helper.fMsg(res, 201, "add tags to server", tag);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    finder
      ? helper.fMsg(res, 200, "get single tag from server by id", finder)
      : next(new Error("no tags with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      if (req.body.image) {
        fs.unlinkSync(`./upload/tags/${finder.image}`);
      }
      await DB.findByIdAndUpdate(finder._id, req.body);
      const tag = await DB.find();
      helper.fMsg(res, 200, "edit tags to server", tag);
    } else next(new Error("no tags with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      fs.unlinkSync(`./upload/tags/${finder.image}`);
      await DB.findByIdAndDelete(finder._id);
      const tag = await DB.find();
      helper.fMsg(res, 200, "delete tags to server", tag);
    } else next(new Error("no tags with that id"));
  },
};
