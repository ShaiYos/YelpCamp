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
    for(let i=0; i<200; i++) {
        const randNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Camp ({
            author: '654cb2907f24aa33fead2028',
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elitEligendi, ea aliquam? Quisquam tempora id officia? Mollitia iste dolor tempore nihil! Id consectetur nesciunt ducimus perspiciatis animi quis vero! Cupiditate, sit!',
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/drqf2nzjq/image/upload/v1700082350/YelpCamp/iegruo4xrdpvgfvz1prm.avif',
                  filename: 'YelpCamp/iegruo4xrdpvgfvz1prm',
                },
                {
                  url: 'https://res.cloudinary.com/drqf2nzjq/image/upload/v1700082350/YelpCamp/hhdtzsr879hi81gcgc49.avif',
                  filename: 'YelpCamp/hhdtzsr879hi81gcgc49',
                },
                {
                  url: 'https://res.cloudinary.com/drqf2nzjq/image/upload/v1700082351/YelpCamp/mn156iwpy0k2vbz43aik.avif',
                  filename: 'YelpCamp/mn156iwpy0k2vbz43aik',
                }
              ],
            geometry: {
                type: "Point", 
                coordinates: [ cities[randNum].longitude , cities[randNum].latitude ]
            }
        });
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})