
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Camp = require('./models/camp');

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log("Database connected!");
    })
    .catch(err => {
        console.log("Database connection REEOR!!");
        console.log(err);
    })


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// just home page
app.get('/', (req,res) => {
    res.render('home');
})

// show all campground
app.get('/campgrounds', async (req,res) => {
    const camps = await Camp.find({});
    res.render('campgrounds/index', {camps});
})

// New Campground
 app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
})

// show details of one campground
app.get('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id);
    res.render('campgrounds/show', {c});
})

// connecting to DB
app.listen(3000, (req,res) => {
    console.log('serving at port 3000!');
})
