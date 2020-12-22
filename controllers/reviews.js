const Theater = require('../models/theater');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const theater = await Theater.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    theater.reviews.push(review);
    await review.save();
    await theater.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/theaters/${theater._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Theater.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/theaters/${id}`);
}