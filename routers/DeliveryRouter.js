const router = require("express").Router();
const controller = require("../controllers/DeliverController");
const DB = require("../models/DeliverModels");
const {
  validToken,
  validRole,
  validUnique,
  validBody,
  validParams,
} = require("../middleware/validator");
const { image } = require("../middleware/ImageTransfer");
const { joiBody, joiParams } = require("../middleware/joiShema");
const { remarkHelper } = require("../middleware/helper");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    image("deliveryService"),
    validBody(joiBody.delivery.body),
    controller.add
  );

router
  .route("/:id")
  .get(validParams(joiParams.id, "id"), controller.get)
  .patch(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    validParams(joiParams.id, "id"),
    image("deliveryService"),
    validBody(joiBody.delivery.patch),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

module.exports = router;
