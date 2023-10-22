const mongoose = require('mongoose');
const Camp = require('../models/camp');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper')

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    .then(() => {
        console.log("Database connected!");
    })
    .catch(err => {
        console.log("Database connection REEOR!!");
        console.log(err);
    })


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Camp.deleteMany({});
    for(let i=0; i<50; i++) {
        const randNum = Math.floor(Math.random() * 1000);
        const camp = new Camp ({
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})