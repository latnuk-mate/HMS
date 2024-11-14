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
const { AuthenticaionError, NotAuthDoctor, NotAuthAdmin, NotAuthUser } = require('./middleware/userAuth');
const app = express(); //express initializer



// setting up the databse..
const connection = require('./config/db');
connection();

// calling localStrategy...
const strategy = require('./config/passportStrategy');
const { Doctor } = require('./Model/doctor');

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


// for user and doctor and admin verification
app.use('/' , AuthenticaionError, require('./route/user'));

// for patient module
app.use('/patient' , NotAuthUser ,  require('./route/main'));

app.use('/admin', NotAuthAdmin, require('./route/admin'));

// for doctor module...
app.use('/doctor', NotAuthDoctor, require('./route/doctor'));

// for admin module...




// rendering some error pages...

app.get('/error/500', (req,res)=>{
    res.render('partials/error_500');
});

app.get('/error/404', (req,res)=>{
    res.render('partials/error_404');
});


    // render docotorImage..

    app.get('/image/:id', async(req,res,next)=>{
        const {id} = req.params;
  
        try {
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                res.send('File not found');
              }
      
            res.set('Content-Type' , doctor.Image.fileContentType);
            res.set('Content-Disposition', `attachment; filename=${doctor.Image.fileName}`);
            res.send(doctor.Image.fileData);
  
        } catch (error) {
          console.log(error.code);
          res.redirect(301, '/error/500');
        }
    })



app.listen(4000 , ()=>{
    console.log('server is running on port 4000 ')
})