const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("index.ejs", { alllisting });
};

module.exports.renderNewForm = (req, res) => {
    res.render("new.ejs");
};

module.exports.createListing = async (req, res) => {
    const image = req.file
        ? {
            filename: req.file.filename,
            url: req.file.path
        }
        : {
            filename: "default-image",
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
        };

    const listing = new Listing({
        ...req.body.listing,
        image
    });
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "new listing created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "cannot find your requested place");
        return res.redirect("/listings");
    }

    const averageRating = listing.reviews.length
        ? Math.round(listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length)
        : 0;

    res.render("show.ejs", { listing, averageRating });
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    Object.assign(listing, req.body.listing);

    if (req.file) {
        listing.image = {
            filename: req.file.filename,
            url: req.file.path
        };
    }

    await listing.save();
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};
