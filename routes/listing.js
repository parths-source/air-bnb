const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(
            400,
            error.details.map((el) => el.message).join(",")
        );
    }

    next();
};

router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("index.ejs", { alllisting });
}));

router.get("/new", (req, res) => {
    res.render("new.ejs");
});

router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {

        if (!req.body.listing.image || !req.body.listing.image.url) {
            req.body.listing.image = {
                filename: "default-image",
                url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
            };
        }

        const listing = new Listing(req.body.listing);
        await listing.save();
        req.flash("success","new listing created!");

        res.redirect("/listings");
    })
);

router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if(!listing){
        req.flash("error","cannot find your requested place");
        res.redirect("/listings");
    }
    res.render("show.ejs", { listing });
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("edit.ejs", { listing });
}));

router.put("/:id", validateListing, wrapAsync(async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    // If user doesn't provide an image, use default image
    if (!req.body.listing.image || !req.body.listing.image.url) {
        req.body.listing.image = {
            filename: "default-image",
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
        };
    }

    Object.assign(listing, req.body.listing);

    await listing.save();
    req.flash("success","listing updated!");

    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
    
}));

module.exports = router;