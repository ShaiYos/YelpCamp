const Joi = require('joi');

module.exports.validateCamps = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        //image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.validateReviews = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});