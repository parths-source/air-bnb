const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listing");
const { isLogged } = require("../middleware");

router.get("/find", wrapAsync(listingController.renderFindPage));
router.get("/favorites", isLogged, wrapAsync(userController.renderFavorites));
router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);

router.get("/login", userController.renderLoginForm);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;