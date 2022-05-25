const DB = require("../models/userModel");
const helper = require("../middleware/helper");
const { roleDB, permitDB } = require("../models");
const { compare } = require("../middleware/helper");

module.exports = {
  all: async (req, res, next) => {
    const user = await DB.find().populate("role permit", "-__v");
    helper.fMsg(res, 200, "all user", user);
  },
  register: async (req, res, next) => {
    req.body.password = helper.encode(req.body.password);
    await new DB(req.body).save();
    const user = await DB.find().populate("role permit", "-__v");
    helper.fMsg(res, 201, "register complete", user);
  },
  login: async (req, res, next) => {
    const email = await DB.findOne({ email: req.body.email }).populate(
      "role permit",
      "-__v"
    );
    if (email) {
      if (compare(req.body.password, email.password)) {
        const data = email.toObject();
        delete data.password;
        data.token = helper.token(data);
        helper.set(data._id, data);
        helper.fMsg(res, 200, "login complete", data);
      } else next(new Error("password wrong"));
    } else next(new Error("no user with that email"));
  },
  addRole: async (req, res, next) => {
    const roleId = await roleDB.findById(req.body.roleId);
    const userId = await DB.findById(req.body.userId);
    if (roleId && userId) {
      const finder = userId.role.find((i) => i.equals(roleId._id));
      if (finder) {
        next(new Error("this role was existing in our server"));
        return;
      }
      await DB.findByIdAndUpdate(userId._id, { $push: { role: roleId._id } });
      const user = await DB.find().populate("role permit", "-__v");
      helper.fMsg(res, 200, "role add complete", user);
    } else next(new Error("something wrong"));
  },
  addPermit: async (req, res, next) => {
    const permitId = await permitDB.findById(req.body.permitId);
    const userId = await DB.findById(req.body.userId);
    if (permitId && userId) {
      const finder = userId.permit.find((i) => i.equals(permitId._id));
      if (finder) {
        next(new Error("this permit was existing in our server"));
        return;
      }
      await DB.findByIdAndUpdate(userId._id, {
        $push: { permit: permitId._id },
      });
      const user = await DB.find().populate("role permit", "-__v");
      helper.fMsg(res, 200, "permit add complete", user);
    } else next(new Error("something wrong"));
  },
  removeRole: async (req, res, next) => {
    const userId = await DB.findById(req.body.userId);
    if (userId) {
      await DB.findByIdAndUpdate(userId._id, {
        $pull: { role: req.body.roleId },
      });
      const user = await DB.find().populate("role permit", "-__v");
      helper.fMsg(res, 200, "remove role complete", user);
    } else next(new Error("no user with that user Id"));
  },
  removePermit: async (req, res, next) => {
    const userId = await DB.findById(req.body.userId);
    if (userId) {
      await DB.findByIdAndUpdate(userId._id, {
        $pull: { permit: req.body.permitId },
      });
      const user = await DB.find().populate("role permit", "-__v");
      helper.fMsg(res, 200, "remove permit complete", user);
    } else next(new Error("no user with that user Id"));
  },
};
