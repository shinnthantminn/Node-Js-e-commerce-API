const DB = require("../models/categoryModel");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const category = await DB.find().populate({
      path: "subCategory",
      populate: {
        path: "childCategory",
        model: "childCategory",
      },
    });
    helper.fMsg(res, 200, "all category from server", category);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const category = await DB.find().populate({
      path: "subCategory",
      populate: {
        path: "childCategory",
        model: "childCategory",
      },
    });
    helper.fMsg(res, 201, "add category complete", category);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    finder
      ? helper.fMsg(res, 200, "get category by id", finder)
      : next(new Error("no category with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      if (req.body.image) {
        fs.unlinkSync(`./upload/category/${finder.image}`);
      }
      await DB.findByIdAndUpdate(finder._id, req.body);
      const category = await DB.find().populate({
        path: "subCategory",
        populate: {
          path: "childCategory",
          model: "childCategory",
        },
      });
      helper.fMsg(res, 200, "edit category complete", category);
    } else next(new Error("no category with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      fs.unlinkSync(`./upload/category/${finder.image}`);
      await DB.findByIdAndDelete(finder._id);
      const category = await DB.find().populate({
        path: "subCategory",
        populate: {
          path: "childCategory",
          model: "childCategory",
        },
      });
      helper.fMsg(res, 200, "delete category complete", category);
    } else next(new Error("no category with that id"));
  },
};
