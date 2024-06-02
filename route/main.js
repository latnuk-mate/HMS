const { NotAuthUser } = require('../middleware/userAuth');

const router = require('express').Router();


router.get('/dashboard', NotAuthUser, (req,res,next)=>{
    res.render('PatientPage' , {user : req.user.userName});
});


router.get('/user/appointment' , (req,res)=>{
    res.render('appointment');
});


router.post('/appointment' , (req,res)=>{
    const {patientName , phone , doctors , date , health} = req.body;
    res.json({patientName , phone , doctors , date , health});
})

module.exports = router;