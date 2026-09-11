const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);

router.get("/login", userController.renderLoginForm);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;