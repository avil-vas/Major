const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControler=require("../controllers/user");

router.route("/signup")
.get(userControler.renderSignupForm)
.post(wrapAsync(userControler.signup));

router.route("/login")
.get(userControler.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userControler.login)


router.get("/logout",userControler.logout);

module.exports=router;