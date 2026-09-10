const Listing = require("./models/listing");
const Review = require("./models/reviews");

module.exports.isLogged=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url if user not present 

        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must login first");
        return res.redirect("/login");
    }
    next();

};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();

};
module.exports.isOwner= async (req,res,next)=>{
    let id=req.params;
    let listingcheck= await Listing.findByid(id);
    if(!listingcheck.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","you are nor the owner");
        res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review || !review.author || String(review.author) !== String(req.user._id)) {
        req.flash("error", "You can only remove your own reviews.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
