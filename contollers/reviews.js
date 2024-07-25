const Listing=require("../models/listing");
const Review=require("../models/review");
const { Types: { ObjectId } } = require('mongoose');


module.exports.createReview=async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;

    // Convert reviewId to ObjectId
    const reviewObjectId = new ObjectId(reviewId);

    // Pull review from Listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewObjectId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewObjectId);
    req.flash("success","review deleted!");

    res.redirect(`/listings/${id}`);
};