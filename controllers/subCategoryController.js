const { categoryDB, subCategoryDB } = require("../models");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const all = await subCategoryDB.find().populate("category childCategory");
    helper.fMsg(res, 200, "all subCategories", all);
  },
  add: async (req, res, next) => {
    const finder = await categoryDB.findById(req.body.category);
    if (finder) {
      const sub = await new subCategoryDB(req.body).save();
      await categoryDB.findByIdAndUpdate(req.body.category, {
        $push: { subCategory: sub._id },
      });
      const all = await subCategoryDB.find().populate("category childCategory");
      helper.fMsg(res, 201, "add subCategories", all);
    } else next(new Error("no category found with that your category "));
  },
  get: async (req, res, next) => {
    const finder = await subCategoryDB
      .findById(req.params.id)
      .populate("category childCategory");
    finder
      ? helper.fMsg(res, 200, "get single subcategory by id", finder)
      : next(new Error("no subCategory with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await subCategoryDB.findById(req.params.id);
    if (finder) {
      if (req.body.image) {
        fs.unlinkSync(`./upload/subCategory/${finder.image}`);
      }

      if (req.body.category) {
        await categoryDB.findByIdAndUpdate(finder.category, {
          $pull: { subCategory: req.params.id },
        });
        await categoryDB.findByIdAndUpdate(req.body.category, {
          $push: { subCategory: req.params.id },
        });
      }

      await subCategoryDB.findByIdAndUpdate(finder._id, req.body);
      const newSub = await subCategoryDB
        .find()
        .populate("category childCategory");
      helper.fMsg(res, 200, "edit subcategory complete", newSub);
    } else next(new Error("no subCategory with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await subCategoryDB.findById(req.params.id);
    if (finder) {
      await categoryDB.findByIdAndUpdate(finder.category, {
        $pull: { subCategory: req.params.id },
      });
      await subCategoryDB.findByIdAndDelete(finder._id);
      fs.unlinkSync(`./upload/subCategory/${finder.image}`);
      const dropper = await subCategoryDB
        .find()
        .populate("category childCategory");
      helper.fMsg(res, 201, "drop subCategory complete", dropper);
    } else next(new Error("no subCategory with that id"));
  },
};
