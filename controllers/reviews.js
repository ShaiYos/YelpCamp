const Camp = require('../models/camp');
const Review = require('../models/review')

module.exports.createReview = async(req,res) => {
    const c = await Camp.findById(req.params.id);
    const r = new Review(req.body.review);
    r.author = req.user._id;
    c.reviews.push(r);
    await r.save();
    await c.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.deleteReview = async(req,res) => {
    const {id,revID} = req.params;
    const c = await Camp.findByIdAndUpdate(id, {$pull: {reviews: revID} });
    const r = await Review.findByIdAndDelete(revID);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${c._id}`)
}