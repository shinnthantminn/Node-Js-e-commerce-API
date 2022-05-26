const helper = require("../middleware/helper");
const DB = require("../models/roleModel");
const permitDB = require("../models/permitModel");

module.exports = {
  all: async (req, res, next) => {
    const role = await DB.find().populate("permit", "-__v");
    helper.fMsg(res, 200, "all role from Server", role);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const role = await DB.find().populate("permit", "-__v");
    helper.fMsg(res, 201, "add role complete", role);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id).populate("permit", "-__v");
    finder
      ? helper.fMsg(res, 200, "get role single by id", finder)
      : next(new Error("no role with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      await DB.findByIdAndUpdate(finder._id, req.body);
      const role = await DB.find().populate("permit", "-__v");
      helper.fMsg(res, 201, "role edit complete", role);
    } else next(new Error("no role with that id"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      await DB.findByIdAndDelete(finder._id);
      const role = await DB.find().populate("permit", "-__v");
      helper.fMsg(res, 201, "role delete complete", role);
    } else next(new Error("no role with that id"));
  },
  addPermit: async (req, res, next) => {
    const role = await DB.findById(req.body.roleId);
    const permit = await permitDB.findById(req.body.permitId);
    if (role && permit) {
      const finder = await role.permit.find((i) => i.equals(permit._id));
      if (finder) {
        next(new Error("this permit was existing in our server"));
      } else {
        await DB.findByIdAndUpdate(role._id, { $push: { permit: permit._id } });
        const newRole = await DB.find().populate("permit", "-__v");
        helper.fMsg(res, 201, "permit add complete Complete", newRole);
      }
    } else next(new Error("something wrong"));
  },
  removePermit: async (req, res, next) => {
    const role = await DB.findById(req.body.roleId);
    if (role) {
      const finder = await role.permit.find((i) => i.equals(req.body.permitId));
      if (finder) {
        await DB.findByIdAndUpdate(role._id, {
          $pull: { permit: req.body.permitId },
        });
        const newRole = await DB.find().populate("permit", "-__v");
        helper.fMsg(res, 201, "permit remove complete Complete", newRole);
      } else next(new Error("no permit with that permitId"));
    } else next(new Error("no role with that roleId"));
  },
};
