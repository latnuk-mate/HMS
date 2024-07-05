require('dotenv').config(); // setting up the env file.
const express = require('express');
const Path = require('path');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const Flash = require('express-flash');
const Session = require('express-session');
const passport = require('passport');
const layouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')

const app = express(); //express initializer



// setting up the databse..
const connection = require('./config/db');
connection();

// calling localStrategy...
const strategy = require('./config/passportStrategy');
strategy();


// setting up the template engine..
app.set('views' , 'views');
app.set('view engine' , 'ejs');
app.set('layout' , "layouts/layout");


// using some middlewares && static file rendering...
app.use(express.urlencoded({extended : false}));
app.use('/', express.static(Path.join(__dirname , "public")));

// initializing the layouts
app.use(layouts);


app.use(cookieParser());
app.use(Flash());
app.use(Session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl : process.env.MONGO_URI,
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    req.flash('flash' , "Incorrect Credentials!");
    next();
})



app.use('/' , require('./route/user'));
app.use('/' , require('./route/main'));





app.listen(4000 , ()=>{
    console.log('server is running on port 4000 ')
})