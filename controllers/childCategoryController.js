const { subCategoryDB, childCategoryDB } = require("../models");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const finder = await childCategoryDB.find().populate("subCategory");
    helper.fMsg(res, 200, "all childCategory from server", finder);
  },
  add: async (req, res, next) => {
    const finder = await subCategoryDB.findById(req.body.subCategory);
    if (finder) {
      const child = await new childCategoryDB(req.body).save();
      await subCategoryDB.findByIdAndUpdate(finder._id, {
        $push: { childCategory: child._id },
      });
      const allChild = await childCategoryDB.find().populate("subCategory");
      helper.fMsg(res, 200, "add child category complete", allChild);
    } else next(new Error("no subCategory found in your SubCategory  "));
  },
  get: async (req, res, next) => {
    const finder = await childCategoryDB
      .findById(req.params.id)
      .populate("subCategory");
    finder
      ? helper.fMsg(res, 200, "get single category by id", finder)
      : next(new Error("no childCategory with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await childCategoryDB.findById(req.params.id);
    if (finder) {
      if (req.body.image) {
        fs.unlinkSync(`./upload/ChildCategory/${finder.image}`);
      }
      if (req.body.subCategory) {
        await subCategoryDB.findByIdAndUpdate(finder.subCategory, {
          $pull: {
            childCategory: finder._id,
          },
        });
        await subCategoryDB.findByIdAndUpdate(req.body.subCategory, {
          $push: { childCategory: finder._id },
        });
      }
      await childCategoryDB.findByIdAndUpdate(finder._id, req.body);
      const allChild = await childCategoryDB.find().populate("subCategory");
      helper.fMsg(res, 201, "edit childCategory complete", allChild);
    } else next(new Error("no childCategory with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await childCategoryDB.findById(req.params.id);
    if (finder) {
      fs.unlinkSync(`./upload/ChildCategory/${finder.image}`);
      await subCategoryDB.findByIdAndUpdate(finder.subCategory, {
        $pull: { childCategory: finder._id },
      });
      await childCategoryDB.findByIdAndDelete(finder._id);
      const allFinder = await childCategoryDB.find().populate("subCategory");
      helper.fMsg(res, 200, "delete ChidCategory complete", allFinder);
    } else next(new Error("no childCategory with that id"));
  },
};
