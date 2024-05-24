require('dotenv').config(); // setting up the env file.
const express = require('express');
const Path = require('path');

const app = express(); //express initializer

// setting up the template engine..
app.set('views' , 'views');
app.set('view engine' , 'ejs');


// using some middlewares && static file rendering...
app.use(express.urlencoded({extended : false}));
app.use('/', express.static(Path.join(__dirname , "public")));


app.use('/user/login' , (req,res)=>{
    res.render('userlogin');
});

app.use('/user/signup' , (req,res)=>{
    res.render('registration');
})


app.post('/login' , (req,res)=>{

    const {phone}  = req.body;
    res.json({"Number" : phone});
});

app.post('/signup' , (req,res)=>{

    const {username, dob , email , phone}  = req.body;
    res.json({"Name" : username , "Date Of Birth" : dob , "Email" : email , "Number" : phone});
});



app.listen(4000 , ()=>{
    console.log('server is running on port 4000 ')
})