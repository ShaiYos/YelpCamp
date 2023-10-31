
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Camp = require('./models/camp');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const expressError = require('./utils/expressError');
const ejsMate = require('ejs-mate');
const {validateSchema} = require('./validateSchema.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log("Database connected!");
    })
    .catch(err => {
        console.log("Database connection REEOR!!");
        console.log(err);
    })


const app = express();

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// middleware function for checking validation
const validateCamp = (req,res,next) => {
    const {error} = validateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elem => elem.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

// just home page
app.get('/', (req,res) => {
    res.render('home');
})

// show all campground
app.get('/campgrounds', catchAsync(async(req,res) => {
    const camps = await Camp.find({});
    res.render('campgrounds/allCamps', {camps});
}))

// New Campground
 app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
})
// making new campground  
app.post('/campgrounds', validateCamp, catchAsync(async (req,res,next) => {
    
    //if((!req.body.campground))
    //     throw new expressError('Invalied Campground Data', 400)
    const c = new Camp(req.body.campground);
    await c.save();
    res.redirect(`/campgrounds/${c._id}`)
    
}))

// show details of one campground
app.get('/campgrounds/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id);
    res.render('campgrounds/show', {c});
}))

// edit campground
app.get('/campgrounds/:id/edit', catchAsync(async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id);
    res.render('campgrounds/edit', {c})
}))

// update campground
app.patch('/campgrounds/:id', validateCamp, catchAsync(async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findByIdAndUpdate(id, {...req.body.campground});
    c.save();
    res.redirect(`/campgrounds/${c._id}`)
}))

// delete campground
app.delete('/campgrounds/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

// in case no route is fit
app.all('*', (req,res,next) => {
    next(new expressError('Page Not Found', 404))
})

// handeling errors
app.use( (err,req,res,next) => {
    const {status=500, message='something went wrong'} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(status).render('error',{err})
})


// connecting to DB
app.listen(3000, (req,res) => {
    console.log('serving at port 3000!');
})
