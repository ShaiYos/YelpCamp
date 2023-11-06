const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const campsSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// delete all reviews when deleting campground
campsSchema.post('findOneAndDelete', async function (camp) {
    if(camp) {
        const del = await review.deleteMany({_id: {$in: camp.reviews}})
        console.log(del.deletedCount)
    }
})

module.exports = mongoose.model('Camp', campsSchema)