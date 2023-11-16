const { validateCamps, validateReviews } = require('./validateSchema.js');
const expressError = require('./utils/expressError');
const Camp = require('./models/camp');
const Review = require('./models/review');

// middleware function for checking that user logged in
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}

// middleware function for saving the returnTo url
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// middleware function for checking validation of campgrounds
module.exports.validateCampFunc = (req,res,next) => {
    const {error} = validateCamps.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

// middleware function for checking if author
module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const c = await Camp.findById(id);
    if(!c.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


// middleware function for checking validation of reviews
module.exports.validateReviewFunc = (req,res,next) => {
    const {error} = validateReviews.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(elem => elem.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

// middleware function for ensuring adding a review only if a user logged in
module.exports.isReviewAuthor = async(req,res,next) => {
    const {id, revID} = req.params;
    const review = await Review.findById(revID);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${c._id}`)
    }
    next();
}