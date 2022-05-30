const router = require("express").Router();
const controller = require("../controllers/categoryController");
const {
  validToken,
  validRole,
  validBody,
  validParams,
  validUnique,
} = require("../middleware/validator");
const { image } = require("../middleware/ImageTransfer");
const { joiBody, joiParams } = require("../middleware/joiShema");
const DB = require("../models/categoryModel");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    image("category"),
    validBody(joiBody.category.body),
    controller.add
  );

router
  .route("/:id")
  .get(validParams(joiParams.id, "id"), controller.get)
  .patch(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    image("category"),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );
module.exports = router;
