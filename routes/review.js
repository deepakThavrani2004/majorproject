const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isloggedin,isReviewAuthor}=require("../middleware.js");
const { Types: { ObjectId } } = require('mongoose');
const { createReview } = require("../contollers/reviews.js");
const reviewController=require("../contollers/reviews.js");


router.post("/", validateReview,isloggedin, wrapAsync(reviewController.createReview));

  
  // Delete review from listing and delete review itself
  router.delete("/:reviewId",isloggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

  module.exports=router;