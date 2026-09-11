if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
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

const { MongoStore } = require('connect-mongo');
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured in production");
}
const sessionSecret = process.env.SESSION_SECRET || "development-only-secret";
const sessionDuration = 7 * 24 * 60 * 60 * 1000;
const sessionStore = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL || process.env.MONGO_URL,
    crypto: { secret: sessionSecret },
    touchAfter: 24 * 3600,
});

const sessionOptions={
    store: sessionStore,
    secret:sessionSecret,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires: new Date(Date.now() + sessionDuration),
        maxAge: sessionDuration,
        httpOnly:true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",

    }
};
app.use(session(sessionOptions));
app.use(flash());
// configuring passport startegy for authentication 


app.use(passport.initialize());
app.use(passport.session());

passport.use(new strategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

const ExpressError = require("./utils/ExpressError");

//router
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter=require("./routes/user");
const personalInfoRouter = require("./controllers/personalinfo");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
    res.send("working");
});

app.use("/",userRouter);
app.use("/", personalInfoRouter);
app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);

const Mongo = process.env.ATLASDB_URL || process.env.MONGO_URL;

if (!Mongo) {
    throw new Error("ATLASDB_URL or MONGO_URL must be configured");
}

async function main() {
    await mongoose.connect(Mongo);
}

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

main()
    .then(() => {
        console.log("connected to database");
        app.listen(process.env.PORT || 8080, () => {
            console.log(`server is running at port ${process.env.PORT || 8080}`);
        });
    })
    .catch((err) => {
        console.error("database connection failed", err);
        process.exitCode = 1;
    });

