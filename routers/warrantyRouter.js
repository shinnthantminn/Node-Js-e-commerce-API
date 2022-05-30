const router = require("express").Router();
const controller = require("../controllers/warrantyController");
const DB = require("../models/warrantyModel");
const {
  validToken,
  validRole,
  validUnique,
  validBody,
  validParams,
} = require("../middleware/validator");
const { image } = require("../middleware/ImageTransfer");
const { joiBody, joiParams } = require("../middleware/joiShema");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    image("warranty"),
    validBody(joiBody.warranty.body),
    controller.add
  );

router
  .route("/:id")
  .get(validParams(joiParams.id, "id"), controller.get)
  .patch(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    validUnique(DB, "name"),
    image("warranty"),
    validBody(joiBody.warranty.patch),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

module.exports = router;
