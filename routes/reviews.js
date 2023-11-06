
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Camp = require('../models/camp');
const Review = require('../models/review')
const expressError = require('../utils/expressError');
const { validateReviews } = require('../validateSchema.js');


// middleware function for checking validation of reviews
const validateReviewFunc = (req,res,next) => {
    const {error} = validateReviews.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(elem => elem.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

// adding new review
router.post('/', validateReviewFunc , catchAsync(async(req,res) => {
    const c = await Camp.findById(req.params.id);
    const r = new Review(req.body.review);
    c.reviews.push(r);
    await r.save();
    await c.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${c._id}`)
}))

// delete review
router.delete('/:revID', catchAsync(async(req,res) => {
    const {id,revID} = req.params;
    const c = await Camp.findByIdAndUpdate(id, {$pull: {reviews: revID} });
    const r = await Review.findByIdAndDelete(revID);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${c._id}`)
}))

module.exports = router;