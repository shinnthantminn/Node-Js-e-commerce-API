const router = require("express").Router();
const controller = require("../controllers/childCategoryController");
const {
  validToken,
  validRole,
  validBody,
  validUnique,
  validParams,
} = require("../middleware/validator");
const { joiBody, joiParams } = require("../middleware/joiShema");
const DB = require("../models/childCategoryModel");
const { image } = require("../middleware/ImageTransfer");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validUnique(DB, "name"),
    image("ChildCategory"),
    validBody(joiBody.childCategory.body),
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
    image("ChildCategory"),
    validBody(joiBody.childCategory.patch),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

module.exports = router;
