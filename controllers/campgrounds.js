const Camp = require('../models/camp');
const { cloudinary } = require('../cloudinary')
const mapBox = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN  ;  
const geocoder = mapBox({accessToken: mapboxToken})

module.exports.allCamps = async(req,res) => {
    const camps = await Camp.find({});
    res.render('campgrounds/allCamps', {camps});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const c = new Camp(req.body.campground);
    c.images = req.files.map(f=> ({url: f.path, filename: f.filename}))
    c.author = req.user._id;
    c.geometry = geoData.body.features[0].geometry;
    console.log(c)
    await c.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.campDetails = async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id)
    .populate({path: 'reviews', populate: {path: 'author'}})
    .populate('author');
    if(!c) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {c});
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findById(id);
    if(!c) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {c})
}

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params;
    const c = await Camp.findByIdAndUpdate(id, {...req.body.campground})
    const imgs = req.files.map(f=> ({url: f.path, filename: f.filename}))
    c.images.push(...imgs)
    await c.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await c.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} } } } )
        console.log(c)
    }
    req.flash('success', 'Successfully Update campground!')
    res.redirect(`/campgrounds/${c._id}`)
}

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}