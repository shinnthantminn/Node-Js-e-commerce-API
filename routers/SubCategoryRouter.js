const router = require("express").Router();
const controller = require("../controllers/subCategoryController");
const DB = require("../models/subCategoryModel");
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
    image("subCategory"),
    validBody(joiBody.subCategory.body),
    controller.add
  );

router
  .route("/:id")
  .get(validParams(joiParams.id, "id"), controller.get)
  .patch(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    validBody(joiBody.subCategory.patch),
    validParams(joiParams.id, "id"),
    image("subCategory"),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

module.exports = router;
