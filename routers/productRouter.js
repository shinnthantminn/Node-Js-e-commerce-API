const router = require("express").Router();
const controller = require("../controllers/productController");
const DB = require("../models/ProductModel");
const {
  validToken,
  validRole,
  validUnique,
  validBody,
  validParams,
} = require("../middleware/validator");
const { images } = require("../middleware/ImageTransfer");
const { arrayChanger } = require("../middleware/helper");
const { joiBody, joiParams } = require("../middleware/joiShema");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name", "brand"),
    arrayChanger("features", "colors", "sizes"),
    images("product"),
    validBody(joiBody.product.body),
    controller.add
  );

router
  .route("/:id")
  .get(validParams(joiParams.id, "id"), controller.get)
  .patch(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    validUnique(DB, "name", "brand"),
    arrayChanger("features", "colors", "sizes"),
    images("product"),
    validBody(joiBody.product.patch),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

router.post("/add/delivery", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.product.delivery),
  controller.addDelivery,
]);

router.post("/add/warranty", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.product.warranty),
  controller.addWarranty,
]);

router.delete("/remove/delivery", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.product.delivery),
  controller.removeDelivery,
]);

router.delete("/remove/warranty", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.product.warranty),
  controller.removeWarranty,
]);

router.get("/paginate/:page", controller.paginate);

module.exports = router;
