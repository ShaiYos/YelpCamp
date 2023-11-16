const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
//const Camp = require('../models/camp');
//const Review = require('../models/review')
//const expressError = require('../utils/expressError');
const users = require('../controllers/users')



router.route('/register')
    // register
    .get(users.renderRegister )

    // creating new user
    .post(catchAsync(users.createUser))



router.route('/login')
    // login
    .get(users.renderLogin)

    // login user 
    .post(storeReturnTo, 
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), 
        users.loginUser)


// logout
router.get('/logout', users.logoutUser);

module.exports = router;

