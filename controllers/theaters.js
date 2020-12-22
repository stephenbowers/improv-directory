const Theater = require('../models/theater');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const theaters = await Theater.find({});
    res.render('theaters/index', { theaters });
}

module.exports.renderNewForm = (req, res) => {
    res.render('theaters/new');
}

module.exports.createTheater = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.theater.location,
        limit: 1
    }).send();
    console.log(geoData);
    const theater = new Theater(req.body.theater);
    theater.geometry = geoData.body.features[0].geometry;
    theater.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    theater.author = req.user._id;
    await theater.save();
    req.flash('success', 'Successfully added a new theater!');
    res.redirect(`/theaters/${theater._id}`);
}

module.exports.showTheater = async (req, res) => {
    const theater = await Theater.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!theater){
        req.flash('error', 'Cannot find that theater!');
        res.redirect('/theaters');
    }
    res.render('theaters/show', { theater });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params; 
    const theater = await Theater.findById(id);
    if(!theater){
        req.flash('error', 'Cannot find that theater!');
        res.redirect('/theaters');
    }
    res.render('theaters/edit', { theater });
}

module.exports.updateTheater = async (req, res) => {   
    const { id } = req.params; 
    const theater = await Theater.findByIdAndUpdate(id, { ...req.body.theater });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    theater.images.push(...imgs);
    await theater.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await theater.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(theater);
    }
    req.flash('success', 'Successfully updated theater!');
    res.redirect(`/theaters/${theater._id}`);
}

module.exports.deleteTheater = async (req, res) => {
    const { id } = req.params;
    await Theater.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted theater!');
    res.redirect('/theaters');
}