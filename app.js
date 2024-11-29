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
const { formatDate } = require('./middleware/helper');
const app = express(); //express initializer

// model
const { Doctor } = require('./Model/doctor');
const { Appointment } = require('./Model/appointment');

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




// custom middlewares..

 // continuously checking expired appointments..
 app.use(async(req,res,next)=>{
    try {
        if(req.user){
                // get the current user appointments...
            const appointments = await Appointment.find({Appointment_Patient : req.user.id});  
                appointments.forEach((app) =>{
                    // check if the date is past form the current date!
                    if(new Date(formatDate(app.Appointment_User_Book_Date, "YYYY-MM-DD")) < new Date()){
                        // set all the status to expired;
                            app.Appointment_Status = 'expired';        
                    }
                });

            await Appointment.create(appointments); // finally save it..
        
        next();  // pass it to the next route..
     }else{
         next();
     }
    } catch (err) {
        throw new Error(err.message);
    }
    
})

// craate a middleware function to automatically delete expired appointments...
app.use("/" , async(req,res,next)=>{
    try {        
        // delete appointments which are expired!
        await Appointment.deleteMany({ Appointment_Status: 'expired' });

         next();

} catch (error) {
    throw new Error(error.message);
}
});



// for user and doctor and admin verification
app.use('/' , AuthenticaionError, require('./route/user'));

// for patient module
app.use('/patient' , NotAuthUser ,  require('./route/main'));
// for admin module...
app.use('/admin', NotAuthAdmin, require('./route/admin'));

// for doctor module...
app.use('/doctor', NotAuthDoctor, require('./route/doctor'));




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
    });


   

app.listen(4000 , ()=>{
    console.log('server is running on port 4000 ');
});