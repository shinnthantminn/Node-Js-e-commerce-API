const router = require("express").Router();
const controller = require("../controllers/userController");
const {
  validBody,
  validUnique,
  validToken,
  validRole,
} = require("../middleware/validator");
const { joiBody } = require("../middleware/joiShema");
const DB = require("../models/userModel");

router
  .route("/")
  .get(controller.all)
  .post(validBody(joiBody.user.login), controller.login);

router.post("/register", [
  validBody(joiBody.user.body),
  validUnique(DB, "email"),
  controller.register,
]);

router.post("/add/role", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.user.Role),
  controller.addRole,
]);

router.delete("/remove/role", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.user.Role),
  controller.removeRole,
]);

router.post("/add/permit", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.user.permit),
  controller.addPermit,
]);

router.delete("/remove/permit", [
  validToken(),
  validRole("Admin"),
  validBody(joiBody.user.permit),
  controller.removePermit,
]);

module.exports = router;
