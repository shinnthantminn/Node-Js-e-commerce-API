const router = require("express").Router();
const controller = require("../controllers/TagController");
const DB = require("../models/TagModel");
const {
  validToken,
  validRole,
  validBody,
  validUnique,
  validParams,
  validPermit,
} = require("../middleware/validator");
const { joiBody, joiParams } = require("../middleware/joiShema");
const { image } = require("../middleware/ImageTransfer");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    image("tags"),
    validBody(joiBody.tag.body),
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
    image("tags"),
    validBody(joiBody.tag.patch),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

module.exports = router;
