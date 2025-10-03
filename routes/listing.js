const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingControler=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

//index and create route combined with .route
router.route("/").get(wrapAsync(listingControler.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingControler.createListing));

//new route
router.get("/new",isLoggedIn,listingControler.renderNewForm);


router.route("/:id").get(wrapAsync(
    listingControler.showListing))
.put(
    isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingControler.updateListing))
.delete(
    isLoggedIn,isOwner,wrapAsync(listingControler.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControler.renderEditForm))

module.exports=router;