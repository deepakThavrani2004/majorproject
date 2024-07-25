const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../contollers/user");
const wrapAsync = require("../utils/wrapAsync");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;
