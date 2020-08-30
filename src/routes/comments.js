const express = require('express');
const router = express.Router({ mergeParams: true });
const middleware = require('../middleware');

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    //find campgrounds by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground });
        }
    });
})

// comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //create a comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', 'Something went wrong');
                    console.log(err);
                } else {
                    //add user and id to comment and save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    //add the comment to the campground and save
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully added comment');
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// comments edit route
router.get('/:commentId/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { campgroundId: req.params.id, comment });
        }
    })
})

// comment update
router.put('/:commentId', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, comment) => {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

// comment delete
router.delete('/:commentId', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.commentId, (err, comment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('back');
        }
    })
})

module.exports = router;