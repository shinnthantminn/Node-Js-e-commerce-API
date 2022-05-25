const router = require("express").Router();
const controller = require("../controllers/roleController");
const {
  validBody,
  validParams,
  validUnique,
  validToken,
  validRole,
} = require("../middleware/validator");
const { joiBody, joiParams } = require("../middleware/joiShema");
const DB = require("../models/roleModel");

router
  .route("/")
  .get(controller.all)
  .post(
    validToken(),
    validRole("Admin"),
    validBody(joiBody.role.body),
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
    validBody(joiBody.role.patch),
    validUnique(DB, "name"),
    controller.edit
  )
  .delete(
    validToken(),
    validRole("Admin"),
    validParams(joiParams.id, "id"),
    controller.drop
  );

router.post("/add/permit", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.role.permit),
  controller.addPermit,
]);
router.delete("/remove/permit", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.role.permit),
  controller.removePermit,
]);

module.exports = router;
