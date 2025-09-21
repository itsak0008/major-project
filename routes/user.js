const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const usercontroller = require("../controller/users");

router.route("/signup")
    .get(usercontroller.randersignupform)
    .post(
        wrapAsync(usercontroller.signup)
    );

router.route("/login")
    .get(usercontroller.randerloginform)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), usercontroller.login)

router.get("/logout", usercontroller.logout);

module.exports = router;