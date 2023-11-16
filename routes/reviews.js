
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Camp = require('../models/camp');
const Review = require('../models/review')
const expressError = require('../utils/expressError');
//const { validateReviews } = require('../validateSchema.js');
const {validateReviewFunc, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

// adding new review
router.post('/',isLoggedIn, validateReviewFunc , catchAsync(reviews.createReview))

// delete review
router.delete('/:revID', catchAsync(reviews.deleteReview))

module.exports = router;