const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // expects req.body.review object
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review Creater");
    res.redirect(`/Listings/${listing._id}`);

};

module.exports.destroyreview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/Listings/${id}`);
};