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
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Camp ({
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: 'http://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elitEligendi, ea aliquam? Quisquam tempora id officia? Mollitia iste dolor tempore nihil! Id consectetur nesciunt ducimus perspiciatis animi quis vero! Cupiditate, sit!',
            price: price
        });
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})