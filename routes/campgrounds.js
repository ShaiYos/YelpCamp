const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Camp = require('../models/camp');
const Review = require('../models/review')
const expressError = require('../utils/expressError');
const { validateCamps } = require('../validateSchema.js');

// middleware function for checking validation of campgrounds
const validateCampFunc = (req,res,next) => {
    const {error} = validateCamps.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

// show all campgrounds
router.get('/', catchAsync(async(req,res) => {
    const camps = await Camp.find({});
    res.render('campgrounds/allCamps', {camps});
}))

// New Campground
 router.get('/new', (req,res) => {
    res.render('campgrounds/new');
})

// adding new campground  
router.post('/', validateCampFunc, catchAsync(async (req,res) => {
    const c = new Camp(req.body.campground);
    await c.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${c._id}`)
    
}))

// show details of one campground
router.get('/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id).populate('reviews');
    if(!c) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {c});
}))

// edit campground
router.get('/:id/edit', catchAsync(async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id);
    if(!c) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {c})
}))

// update campground
router.patch('/:id', validateCampFunc, catchAsync(async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findByIdAndUpdate(id, {...req.body.campground});
    await c.save();
    req.flash('success', 'Successfully Update campground!')
    res.redirect(`/campgrounds/${c._id}`)
}))

// delete campground
router.delete('/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;