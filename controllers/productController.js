const DB = require("../models/ProductModel");
const { deliveryDB, warrantyDB } = require("../models");
const helper = require("../middleware/helper");
const fs = require("fs");

module.exports = {
  all: async (req, res, next) => {
    const product = await DB.find()
      .populate({
        path: "category",
        populate: {
          path: "subCategory",
          model: "subCategory",
          populate: {
            path: "childCategory",
            model: "childCategory",
          },
        },
      })
      .populate({
        path: "subCategory",
        populate: {
          path: "childCategory",
          model: "childCategory",
        },
      })
      .populate("childCategory tag delivery warranty");
    helper.fMsg(res, 200, "all product from server", product);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const product = await DB.find();
    helper.fMsg(res, 200, "add product to server", product);
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id)
      .populate({
        path: "category",
        populate: {
          path: "subCategory",
          model: "subCategory",
          populate: {
            path: "childCategory",
            model: "childCategory",
          },
        },
      })
      .populate({
        path: "subCategory",
        populate: {
          path: "childCategory",
          model: "childCategory",
        },
      })
      .populate("childCategory tag delivery warranty");
    finder
      ? helper.fMsg(res, 200, "single get by id", finder)
      : next(new Error("no product with that id"));
  },
  edit: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      if (req.body.images) {
        const image = finder.images.split(",");
        console.log(image);
        image.forEach((i) => {
          fs.unlinkSync(`./upload/product/${i}`);
        });
      }
      await DB.findByIdAndUpdate(finder._id, req.body);
      const product = await DB.findById(finder._id);
      helper.fMsg(res, 201, "edit complete", product);
    } else next(new Error("no product with that id"));
  },
  addDelivery: async (req, res, next) => {
    const deliveryId = await deliveryDB.findById(req.body.deliveryId);
    const productId = await DB.findById(req.body.productId);
    if (deliveryId && productId) {
      const finder = productId.delivery.find((i) => i.equals(deliveryId._id));
      if (finder) {
        next(new Error("this delivery service was existing in these product"));
        return;
      }
      await DB.findByIdAndUpdate(productId._id, {
        $push: { delivery: deliveryId._id },
      });
      const product = await DB.find();
      helper.fMsg(res, 201, "delivery service add complete", product);
    } else next(new Error("something wrong"));
  },
  addWarranty: async (req, res, next) => {
    const warrantyId = await warrantyDB.findById(req.body.warrantyId);
    const productId = await DB.findById(req.body.productId);
    console.log(warrantyId, productId);
    if (warrantyId && productId) {
      const finder = productId.warranty.find((i) => i.equals(warrantyId._id));
      if (finder) {
        next(new Error("this warranty service was existing in these product"));
        return;
      }
      await DB.findByIdAndUpdate(productId._id, {
        $push: { warranty: warrantyId._id },
      });
      const product = await DB.find();
      helper.fMsg(res, 201, "delivery service add complete", product);
    } else next(new Error("someting wrong"));
  },
  removeDelivery: async (req, res, next) => {
    const product = await DB.findById(req.body.productId);
    if (product) {
      const finder = product.delivery.find((i) =>
        i.equals(req.body.deliveryId)
      );
      if (!finder) {
        next(new Error("no delivery Services found with this deliveryId"));
        return;
      }
      await DB.findByIdAndUpdate(product._id, {
        $pull: { delivery: req.body.deliveryId },
      });
      const item = await DB.findById(product._id);
      helper.fMsg(res, 201, "delivery remove complete", item);
    } else next(new Error("no product fount"));
  },
  removeWarranty: async (req, res, next) => {
    const product = await DB.findById(req.body.productId);
    if (product) {
      const finder = product.warranty.find((i) =>
        i.equals(req.body.warrantyId)
      );
      if (!finder) {
        next(new Error("no warranty Services found with this warrantyId"));
        return;
      }
      await DB.findByIdAndUpdate(product._id, {
        $pull: { warranty: req.body.warrantyId },
      });
      const item = await DB.findById(product._id);
      helper.fMsg(res, 201, "warranty remove complete", item);
    } else next(new Error("no product fount"));
  },
  drop: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (finder) {
      const image = finder.images.split(",");
      image.map((i) => {
        fs.unlinkSync(`./upload/product/${i}`);
      });
      await DB.findByIdAndDelete(finder._id);
      const product = await DB.find()
        .populate({
          path: "category",
          populate: {
            path: "subCategory",
            model: "subCategory",
            populate: {
              path: "childCategory",
              model: "childCategory",
            },
          },
        })
        .populate({
          path: "subCategory",
          populate: {
            path: "childCategory",
            model: "childCategory",
          },
        })
        .populate("childCategory tag delivery warranty");
      helper.fMsg(res, 201, "delete complete", product);
    } else next(new Error("no product fount"));
  },
  paginate: async (req, res, next) => {
    if (req.params.page > 0) {
      const page = +req.params.page;
      const limit = +process.env.POINT;
      const reqPage = page === 1 ? 0 : page - 1;
      const skipCount = limit * reqPage;
      console.log(skipCount, reqPage);
      const product = await DB.find().skip(skipCount).limit(limit);
      helper.fMsg(res, 200, `page ${page}`, product);
    } else next(new Error("page was no found"));
  },
  filterBy: async (req, res, next) => {
    console.log(req.params.page);
    if (req.params.page > 0) {
      const page = +req.params.page;
      const limit = +process.env.POINT;
      const reqPage = page === 1 ? 0 : page - 1;
      const skipCount = limit * reqPage;
      const finder = {};
      finder[req.query.filter] = req.params.id;
      const result = await DB.find(finder)
        .skip(skipCount)
        .limit(limit)
        .populate({
          path: "category",
          populate: {
            path: "subCategory",
            model: "subCategory",
            populate: {
              path: "childCategory",
              model: "childCategory",
            },
          },
        })
        .populate({
          path: "subCategory",
          populate: {
            path: "childCategory",
            model: "childCategory",
          },
        })
        .populate("childCategory tag delivery warranty");
      helper.fMsg(res, 200, `filter by ${req.query.filter}`, result);
    } else next(new Error("no page found with minus and 0 value"));
  },
};
