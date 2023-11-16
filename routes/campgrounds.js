const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Camp = require('../models/camp');
const Review = require('../models/review')
const expressError = require('../utils/expressError');
const { validateCamps } = require('../validateSchema.js');
const {isLoggedIn, isAuthor,validateCampFunc} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    // show all campgrounds
    .get(catchAsync(campgrounds.allCamps))
    
    // adding new campground 
    .post(isLoggedIn, upload.array('campground[image]'), validateCampFunc,
        catchAsync(campgrounds.createCampground))


// New Campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    // show details of one campground
    .get(catchAsync(campgrounds.campDetails))

    // update campground
    .patch( isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampFunc, 
        catchAsync(campgrounds.updateCampground))
    
    // delete campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// New Campground form
 router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, 
catchAsync(campgrounds.renderEditForm))

module.exports = router;