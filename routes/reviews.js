const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
const {
    validateReviews,
    isloggedIn,
    isreviewAuthor
} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");

router.post("/", isloggedIn, validateReviews, wrapAsync(reviewController.createreview));

router.delete("/:reviewId", isloggedIn, isreviewAuthor, wrapAsync(reviewController.destroyreview));


module.exports = router;