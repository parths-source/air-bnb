const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing = require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const wrapAsync=require("./utils/wrapAsync");
const { listingSchema, reviewSchema } = require("./schema");
const Review=require("./models/reviews");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public"))); 

app.set("view engine", "ejs");app
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);

app.get("/",(req,res)=>{
    res.send("working");
})

// validate the server side listing

const ValidateSchema=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details.map(el=>el.message).join(","));
    }
    next();
}
const ValidateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details.map(el=>el.message).join(","));
    }
    next();
}


const Mongo='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(Mongo);
}


app.get("/listings" , wrapAsync(async(req,res)=>{

    let alllisting=await Listing.find({})
    res.render("index.ejs",{alllisting});
    
}));

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/listings", wrapAsync(async(req,res)=>{

    listingSchema.validate(req.body);

    if(listingSchema.validate(req.body).error){

        const msg=listingSchema.validate(req.body).error.details.map(el=>el.message).join(",");

        throw new ExpressError(400,msg);
    }

    const {title,description,image,price,location,country}=req.body.listing;

    const newListing=new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listings");

}));

//show route 

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("show.ejs",{listing});
}));

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
}));

app.put("/listings/:id",ValidateSchema ,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body);
    res.redirect(`/listings/${listing._id}`);
}));

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// creating a review and saving to database

app.post("/listings/:id/reviews",ValidateReview, wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);


}));

// deleting a review
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req,res)=>{
    const{id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id , {$pull: { reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
 
}));

app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.listen(8080,()=>{
    console.log("server is running at port 8080");

});
app.use((err,req,res,next)=>{  
    
    let {statusCode=500,message="Something went wrong"}=err;     
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err})
});

