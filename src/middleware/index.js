const Campground = require('../models/campground');
const Comment = require('../models/comment');

module.exports = {

    // middleware to check if the campground belong to a user
    async checkCampgroundOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            await Campground.findById(req.params.id, (err, campground) => {
                if (err) {
                    req.flash('error', 'Campground not found');
                    res.redirect('back');
                } else {
                    //check if the user owns the campground
                    if (campground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("Not allowed");
                        res.redirect('back');
                    }
                }
            })
        } else {
            req.flash('error', 'You need to be logged in to do that');
            res.redirect('back');
        }
    },

    // middleware to check if the comment belong to a user
    async checkCommentOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            await Comment.findById(req.params.commentId, (err, comment) => {
                if (err) {
                    res.redirect('back');
                } else {
                    // check if the user own the comment
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error', 'Not allowed');
                        res.redirect('back');
                    }
                }
            })
        } else {
            req.flash('error', 'You need to be logged in to do that');
            res.redirect('back');
        }
    },

    // middleware to check if a user is logged in
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
};