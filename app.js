const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

const campgrounds = [
    { name: "Salmon Creek", image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350" },
    { name: "Granite Hill", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350" }
];

app.get("/campgrounds", (req, res) => {
    
    res.render("campgrounds", { campgrounds });
});

app.post("/campgrounds", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;

    campgrounds.push({
        name,
        image
    });
    
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
})

app.listen(3000);