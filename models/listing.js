const mongoose=require("mongoose");
const Review=require("./reviews.js")
const User=require("./user.js");
const { ref } = require("joi");
const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1682685795557-976f03aca7b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8";

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
image:{
   url:{
    type:String,
   },
   filename:{
    type:String
}},
    country:{
        type:String,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
    ,owner:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }]
    ,
    geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        console.log("working");
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
