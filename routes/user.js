const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware");

//siqnup get request to render form
router.get("/signup",(req,res)=>{
    res.render("signup.ejs");

});
// post request to add to database
router.post("/signup",async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const RegisteredUser= await User.register(newUser,password);
        req.login(RegisteredUser, (err) => {
            if (err) {
                return next(err);
            }
            console.log(RegisteredUser);
            req.flash("success","Explore your new adventure");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error","That account already exists. Please sign in.");
        res.redirect("/login");
    }
});

//login form

router.get("/login",(req,res)=>{

    res.render("login.ejs");
});


//post request to check if user exist or not

router.post("/login", async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });

        if (!existingUser) {
            req.flash("error", "No account found with that username. Please create an account.");
            return res.redirect("/signup");
        }

        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash("error", "Incorrect password. Please try again.");
                return res.redirect("/login");
            }

            req.logIn(user, (loginError) => {
                if (loginError) {
                    return next(loginError);
                }
                let redirectUrl = req.session.redirectUrl || "/listings";

                delete req.session.redirectUrl;

                res.redirect(redirectUrl);
            });
        })(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
});




module.exports = router;