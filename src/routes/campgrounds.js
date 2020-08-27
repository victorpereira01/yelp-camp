const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

// show all camgrounds 
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds });
        }
    });
});

// create a new campground
router.post('/', isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }

    Campground.create({
        name,
        image,
        description,
        author
    }, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// show more info about one campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground });
        }
    });
})

// form to edit a campground
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', {campground});
        }
    })
})

// edit a campground logic
router.put('/:id', (req, res) => {
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if(err) {
            res.redirect('/campgrounds');
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