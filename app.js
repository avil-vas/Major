// if(process.env.NODE_ENV != "production")
// {
require('dotenv').config();
// }
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing")
const path=require("path");
const method_override=require("method-override");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");

app.use(method_override("_method"));
const ejsMate=require("ejs-mate");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js")
const {reviewSchema}=require("./schema.js")
const Review=require("./models/reviews.js");

const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const User=require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
const dburl=process.env.ATLAS_DB_URL;

main().then((res)=>{
    console.log("database is working");
}).catch(err =>{
    console.log(err);
})

async function main(params) {
    await mongoose.connect(dburl);
}

app.listen(3000,()=>{
    console.log("app is listening");
})

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
};
store.on("error",()=>{
 console.log("Error in Mongo session store");
}
)

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user || null;
    next();
})

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"avil@gmail.com",
//         username:"avi"

//     });

//     let registeredUser=await User.register(fakeUser,"hello");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, 'Page not found'));
// });


app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    console.log(err);
    res.status(status).render("error.ejs",{message});
});