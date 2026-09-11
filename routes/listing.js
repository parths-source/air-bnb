const express = require("express");
const router = express.Router();

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const { isLogged,isOwner } = require("../middleware");
const listingController = require("../controllers/listing");
const multer  = require('multer')
const {storage}=require("../cloudConfig");

const upload = multer({ storage });

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

router.get("/", wrapAsync(listingController.index));


// create route 

router.get("/new", isLogged, listingController.renderNewForm);

router.post(
    "/",
    upload.single("listing[image]"),
     validateListing,
    wrapAsync(listingController.createListing)
 );


//show route

router.get("/:id", wrapAsync(listingController.showListing));

// edit route 

router.get("/:id/edit", isLogged, wrapAsync(listingController.renderEditForm));

router.put(
    "/:id",
    upload.single("listing[image]"),
    validateListing,
    isOwner,
    wrapAsync(listingController.updateListing)
);

//delete route

router.delete("/:id", isLogged, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;