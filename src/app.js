const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const seedDB = require('./database/seeds');

const Campground = require('./models/campground');

const app = express();

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

seedDB();

app.get("/", (req, res) => {
    res.render("landing");
}); 

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) { 
            console.log(err);
        } else {
            res.render("index", { campgrounds });
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
    res.render("new.ejs");
})

app.get("/campgrounds/:id", (req, res) => {
    
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {campground});
        }
    });
})

app.listen(3000);