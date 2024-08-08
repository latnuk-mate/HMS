const {Router} = require('express');
const  bcrypt = require('bcrypt');
const passport = require('passport')
const router = Router();

const {Patient} = require('../Model/patient');
const { AuthUser, AuthAdmin, AuthDoctor } = require('../middleware/userAuth');
const { Doctor } = require('../Model/doctor');


router.get('/user/login', AuthUser, (req,res)=>{
    res.render('verification/userlogin');
});

router.get('/user/signup' , AuthUser, (req,res)=>{
    res.render('verification/registration');
});

router.get('/doctor/signIn' , AuthDoctor,  (req,res)=>{
    res.render('verification/doctorLogin' ,  {error : ""})
});

router.get('/admin/signIn' , AuthAdmin, (req,res)=>{
    res.render('verification/adminLogin' , {error : ""})
})


router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/user/login' , failureFlash : true}),
  function(req, res) {
    res.redirect(`/dashboard`);
  });


router.post('/signup' , async(req,res)=>{
    const {username, email , phone , password}  = req.body;
    const salt = bcrypt.genSaltSync(10);
    try{
        const patient = await Patient.create({
            userName : username,
            userEmail : email,
            userPhone : phone,
            userPass : bcrypt.hashSync(`${password}` , salt),
            createdAt : new Date()
        });
    
        await patient.save();
        res.sendStatus(200).json("data saved successfully!");
    }
    catch(err){
        console.log(err.message);
    }
});


router.post('/doctor/post/login' , async(req, res, next)=>{
    const {doctorId , doctorPass} = req.body;

    const doctorData = await Doctor.findOne({Password : doctorPass});

    if(!doctorData){
        res.render('verification/doctorLogin' , {error : req.flash("flash")});
    }else{
        
        try{
            if(doctorId === doctorData.userName && doctorPass === doctorData.Password){
                req.session.regenerate((err)=>{
                    if(err){next(err)}
    
                    req.session.user = doctorData.id;
    
                    req.session.save((err)=>{
                        if(err){
                             return next(err)
                          }
                       res.redirect(`/doctor/dashboard/${doctorData.id}`); 
                    });
                });
    
            }
        }catch(err){
            res.sendStatus(500).json(err);
        }
    }
    
});


router.post('/admin/post/login' , (req, res)=>{
    const {adminId , adminPass} = req.body;
    try{
        if(adminId === process.env.ADMIN_ID && adminPass === process.env.ADMIN_PASS){
            res.cookie('admin' , true);
            res.status(302).redirect('/admin/dashboard');
        }else{
            res.render("verification/adminLogin" , {error : req.flash("flash")});
        }
    }catch(err){
        res.sendStatus(500).json(err);
    }
});

router.get('/user/logout' , (req,res,next)=>{
    req.logOut((err)=>{
        if(err) throw err;
    });
    res.redirect('/user/login');
});

router.get('/admin/logout', (req,res)=>{
    res.clearCookie('admin')
    .redirect(302 , '/admin/signIn');
});

router.get('/doctor/logout', (req,res, next)=>{
    req.session.user = null;
    req.session.save((err)=>{
        if(err){
            next(err);
        }

        req.session.regenerate((err)=>{
            if(err){
                next(err);
            }
            res.redirect(302, '/doctor/signIn');
        })
    })
})


module.exports = router;