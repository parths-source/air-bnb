const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing = require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public"))); 

app.set("view engine", "ejs");app
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs", ejsMate);

app.get("/",(req,res)=>{
    res.send("working");
})


const Mongo='mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(Mongo);
}

// app.get("/samplelisting",async (req,res)=>{
//     const sampleListing=new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for demonstration purposes.",
//         image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhdmVsJTIwc2NlbmVyeXxlbnwwfHwwfHx8&w=1000&q=80",
//         price: 100,
//         location: "Sample Location",
//         country: "Sample Country"
//     });

//     await sampleListing.save();
//     console.log("Sample listing created!");
//     res.send("Sample listing created!");
// });

app.get("/listings" , async(req,res)=>{

    let alllisting=await Listing.find({})
    res.render("index.ejs",{alllisting});
    
});

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/listings",async(req,res)=>{
    const {title,description,image,price,location,country}=req.body;
    const newListing=new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("show.ejs",{listing});
});

app.get("/listings/:id/edit",async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
});

app.put("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body);
    res.redirect(`/listings/${listing._id}`);
});
app.delete("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log("server is running at port 8080");

});

