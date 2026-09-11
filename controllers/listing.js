const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const category = req.query.category;
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const allowedCategories = ["mountains", "iconic cities", "arctic", "beaches"];
    const filter = {};

    if (category && allowedCategories.includes(category)) {
        filter.category = category;
    }

    if (query) {
        const searchPattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [
            { title: searchPattern },
            { description: searchPattern },
            { location: searchPattern },
            { country: searchPattern },
            { category: searchPattern }
        ];
    }

    const alllisting = await Listing.find(filter);
    const favoriteIds = req.user ? (req.user.favorites || []).map((id) => String(id)) : [];
    res.render("index.ejs", { alllisting, selectedCategory: filter.category, favoriteIds });
};

module.exports.toggleFavorite = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const favoriteIds = (req.user.favorites || []).map((id) => String(id));
    const isFavorite = favoriteIds.includes(String(listing._id));
    const update = isFavorite
        ? { $pull: { favorites: listing._id } }
        : { $addToSet: { favorites: listing._id } };

    await req.user.updateOne(update);
    req.flash("success", isFavorite ? "Removed from favorites." : "Saved to your favorites.");
    res.redirect(req.get("Referrer") || "/listings");
};

module.exports.renderNewForm = (req, res) => {
    res.render("new.ejs");
};

module.exports.renderFindPage = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("find.ejs", { alllisting });
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
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    res.render("edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

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
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};
