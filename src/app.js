const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const seedDB = require('./database/seeds');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const cors = require('cors');

const campgroundRoutes = require('./routes/campgrounds');
const commentsRoutes = require('./routes/comments');
const authRoutes = require('./routes/index');

const User = require('./models/user');

const app = express();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.log(error.message));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

app.locals.moment = require('moment');

//seedDB();

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

app.listen(PORT, process.env.IP);