const router = require("express").Router();
const controller = require("../controllers/OrderController");
const { validToken, validRole } = require("../middleware/validator");

router.post("/", [validToken(), controller.add]);
router.get("/", [validToken(), controller.get]);
router.get("/:page", [validToken(), validRole("Admin"), controller.all]);

module.exports = router;
