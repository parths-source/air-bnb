const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport=require("passport")
//siqnup get request to render form
router.get("/signup",(req,res)=>{
    res.render("signup.ejs");

});
// post request to add to database
router.post("/signup",async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const RegisteredUser= await User.register(newUser,password);
        console.log(RegisteredUser);
        req.flash("success","Explore your new adventure");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error","user exist, please log in ");
        res.redirect("/listings");
    }
});

//login form

router.get("/login",(req,res)=>{
res.render("login.ejs");
});


//post request to check if user exist or not

router.post("/login",
     passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}),
      async(req,res)=>{
       try{
        req.flash("success","you are logged in");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error","incorrect details");
        res.redirect("/listings");
    }
});




module.exports = router;