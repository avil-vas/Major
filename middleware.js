const Listing= require("./models/listing");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
        if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged into create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner[0]._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    // Default to {} so Joi won't crash if req.body is undefined
    const { error } = listingSchema.validate(req.body || {});

    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }

    next();
};

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body || {});
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author[0]._id.equals(res.locals.currUser._id)){
     req.flash("error","You have no permission to delete this review");
     return res.redirect(`/listings/${id}`);
    }
    next();
}
