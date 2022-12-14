const router = require("express").Router();
const controller = require("../controllers/permitController");
const {
  validBody,
  validUnique,
  validParams,
  validToken,
  validRole,
  validPermit,
} = require("../middleware/validator");
const { joiBody, joiParams } = require("../middleware/joiShema");
const DB = require("../models/permitModel");

router.route("/").get(controller.all).post(
  validToken(),
  // validRole("Admin"),
  validPermit("can add post"),
  validBody(joiBody.permit.body),
  validUnique(DB, "name"),
  controller.add
);

router
  .route("/:id")
  .get(validParams(joiParams.id, "id"), controller.get)
  .patch(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    validBody(joiBody.permit.patch),
    validUnique(DB, "name"),
    controller.edit
  )
  .delete(
    validToken(),
    // validRole("Admin"),
    validPermit("can delete post"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

module.exports = router;
