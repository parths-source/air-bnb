const express = require("express");
const router = express.Router();

const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const { isLogged, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/review");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(
            400,
            error.details.map((el) => el.message).join(",")
        );
    }

    next();
};

router.post("/:id/reviews", isLogged, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:id/reviews/:reviewId", isLogged, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;