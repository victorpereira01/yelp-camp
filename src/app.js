const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const seedDB = require('./database/seeds');
const passport = require('passport');
const localStrategy = require('passport-local');

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/public"));
app.set("view engine", "ejs");

seedDB();

// Passport config

app.use(require('express-session')({
    secret: 'Kyra is the cutest dog',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===================
// Campground Routes
// ===================
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds });
        }
    });
});

app.post("/campgrounds", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;

    Campground.create({
        name,
        image,
        description
    }, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", (req, res) => {

    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground });
        }
    });
})

// ===================
// Comment Routes
// ===================
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground });
        }
    });
})

app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})


// ===============
// Auth Routes
// ===============

// render register form
app.get('/register', (req, res) => {
    res.render('register');
})

// handling sign up logic
app.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        }) 
    })
})

// render login form
app.get('/login', (req, res) => {
    res.render('login');
})

// handling login logic
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
    
})

app.listen(3000);