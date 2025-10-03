const Listing= require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
let alllistings=await Listing.find();
res.render("./listings/index.ejs",{alllistings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
let {id}=req.params;
let listing=await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author"
}}).populate("owner");

if(!listing){
    req.flash("error","listing you requested does not exists");
   return res.redirect("/listings");
};
res.render("./listings/show.ejs",{listing});

};

module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location ,
        limit: 1
        })
        .send();
    // let {title,description,price,image,country,location}=req.body;
    // compact method
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.geometry=response.body.features[0].geometry;
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    let newlist=await newlisting.save();
    console.log(newlist);
    req.flash("success","New listing Created");
    res.redirect("/listings");
  
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
    req.flash("error","listing you requested does not exists");
   return res.redirect("/listings");
}    
    let listingImage=list.image.url;
    if(listingImage.startsWith("https://res.cloudinary.com")){
     listingImage=listingImage.replace("/upload","/upload/w_250");
    }
    res.render("./listings/edit.ejs",{list,listingImage});
};

module.exports.updateListing=async(req,res)=>{

    let {id}=req.params;
    let listing=req.body.listing;
    let ulisting=await Listing.findByIdAndUpdate(id,listing);
    if(typeof(req.file) != "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    ulisting.image={url,filename};
    await ulisting.save();
    }
    req.flash("success","listing edited");
    res.redirect("/listings")

};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings")

};