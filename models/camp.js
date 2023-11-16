const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


const imageSchema = new Schema({
    url: String,
    filename: String
})

// imageSchema.virtual('thumbnail').get(function () {
//     return this.url.replace('/upload', '/upload/w_200/')
//     console.log(this.thumbnail)
// })

const opts = { toJSON: { virtuals: true } }

const campsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            //required: true
        },
        coordinates: {
            type: [Number],
            //required: true
        }
    }
}, opts);


campsSchema.virtual('properties.popupMarkup').get( function() {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,25)}...</p>`
})


// delete all reviews when deleting campground
campsSchema.post('findOneAndDelete', async function (camp) {
    if(camp) {
        const del = await review.deleteMany({_id: {$in: camp.reviews}})
        console.log(del.deletedCount)
    }
})

module.exports = mongoose.model('Camp', campsSchema)