const Listing = require("./models/listing");
const Review = require("./models/reviews");

module.exports.isLogged=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url if user not present 

        req.session.redirectUrl=req.get("Referrer") || req.originalUrl;
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
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!listing.owner || String(listing.owner) !== String(req.user._id)) {
        req.flash("error","you are nor the owner");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review || !review.author || String(review.author) !== String(req.user._id)) {
        req.flash("error", "You can only remove your own reviews.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
