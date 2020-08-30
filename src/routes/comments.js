const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// comments new
router.get("/new", isLoggedIn, (req, res) => {
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
router.post("/", isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            //create a comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //add user and id to comment and save
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    //add the comment to the campground and save
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// comments edit route
router.get('/:commentId/edit', (req, res) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { campgroundId: req.params.id, comment });
        }
    })
})

// comment update
router.put('/:commentId', (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, comment) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;