const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing");
const {validatereview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewControler=require("../controllers/reviews.js");

router.post("/",isLoggedIn,validatereview,wrapAsync(reviewControler.createReview));

router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewControler.destroyReview
))

module.exports=router;