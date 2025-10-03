const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main().then((res)=>{
    console.log("database is working");
}).catch(err =>{
    console.log(err);
})

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async ()=>{
   await Listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({...obj,owner:'68c02973f06d97bf9894d88e'}));
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");
}

initDB();