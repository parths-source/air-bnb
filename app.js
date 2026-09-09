const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash=require("connect-flash");
const passport=require("passport");
const strategy=require("passport-local");
const  User=require("./models/user");
//express session
const session=require("express-session")
const sessionOptions={
    secret:"my code",
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:Date.now()+ 7*24*60*60*1000,
        httpOnly:true,

    }
};
app.use(session(sessionOptions));
app.use(flash());
// configuring passport startegy for authentication 


passport.initialize();
passport.session();
passport.use(new strategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

const ExpressError = require("./utils/ExpressError");

//router
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter=require("./routes/user");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
    res.send("working");
});

app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/",userRouter);

const Mongo = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(Mongo);
}

main()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).render("error.ejs", { err: { message } });
});

app.listen(8080, () => {
    console.log("server is running at port 8080");
});

