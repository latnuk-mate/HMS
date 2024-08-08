// doctors module pages functions...

const router = require("express").Router();
const { Passport } = require("passport");
const { NotAuthDoctor } = require("../middleware/userAuth");
const { Appointment } = require("../Model/appointment");
const { Doctor } = require("../Model/doctor");
const { Patient } = require("../Model/patient");
const { Staff } = require("../Model/staff");




router.get('/doctor/dashboard/:id', NotAuthDoctor,  async(req, res)=>{
    const doctorId = req.params.id;
    try {
      
      const patientData = await Patient.find({});
      const doctors = await Doctor.find({});
      const doctorData = await Doctor.findById(doctorId);
      const appointments = await Appointment.find({});
      res.render('doctor/dashboard',
       {layout: 'layouts/doctorModule',
         helper: require("../middleware/helper"),
         doctors,
         patientData,
         appointments,
         data: doctorData
        });
    } catch (error) {
      res.redirect(302 , '/error/500');
    }
  });
  
  router.get('/doctor/accounts/:id', async(req,res)=>{
    const doctorId = req.params.id;
    try {
      const doctorData = await Doctor.findById(doctorId);
      res.render('doctor/profile', 
        {layout: 'layouts/doctorModule',
           data: doctorData,
           passUpdated: false,
           helper: require("../middleware/helper")
        });
  
    } catch (error) {
      res.redirect(302 , '/error/500');
    }
  });


router.post('/doctor/pass/update/:id', NotAuthDoctor , async(req,res)=>{
  const { newPass, oldPass } = req.body;
  const id = req.params.id;
    try {
      const doctor = await Doctor.findById(id);
      if(doctor.Password === oldPass){
         await Doctor.findByIdAndUpdate(id, {Password : newPass}, (err)=>{
            if(err) {
              res.render('partials/error_500' , {error: err.message});
            }
        });
        res.render('doctor/profile', 
          {layout: 'layouts/doctorModule',
             data: doctor,
             passUpdated: true,
             helper: require("../middleware/helper")
          });
      }else{
        // prepare some page for graceful errors...
        res.sendStatus(404).json({err: "error"})
      }

    } catch (error) {
      res.redirect(302, '/error/500');
    }
})


  
  router.get('/doctor/appointment/panel/:id/:query?', async(req, res)=>{
    const query = req.params.query;
  
    try {
      const doctors = await Doctor.findById(req.params.id);
      const apponitments = await Appointment.find({});
      if(query === undefined){
        res.render('doctor/appointmentPage', 
        {layout : 'layouts/doctorModule', 
        appointments : apponitments,
        data: doctors,
        helper: require("../middleware/helper"),
        length : 0, currentDate : new Date()});
      }
  
      if(query === "pending"){
        res.render('doctor/PendingAppointment', 
          {layout : 'layouts/doctorModule', 
          appointments : apponitments,
          data: doctors,
          helper: require("../middleware/helper"),
            });
      }
  
  
  } catch (error) {
    res.redirect(302 , '/error/500');
  }
  });
  
  router.get('/user/appointment/confirmed/:id', async(req, res)=>{
    const app_id = req.params.id;
    const id = req.session.user;
    try{
      const app_data = await Appointment.findById(app_id);
      app_data.Appointment_Status = "approved";
      await Appointment.create(app_data);
      res.redirect(302, `/doctor/appointment/panel/${id}`);
    }catch(err){
      res.render('partials/error_500' , {error: err.message});
    }
  });
  
  router.get('/user/appointment/cancel/:id', async(req,res)=>{
    const app_id = req.params.id;
    const id = req.session.user;
    try{
      await Appointment.findByIdAndDelete(app_id, (err)=>{
        if(err){
          res.redirect(302 , '/error/500');
        }else{
          res.redirect(302, `/doctor/appointment/panel/${id}`);
        }
      });
     
    }catch(err){
      res.redirect(302 , '/error/500');
    }
  });
  
  router.get('/doctor/patient/panel/:id', NotAuthDoctor, async(req,res)=>{
      try {
        const data = await Doctor.findById(req.params.id);
         const appointments = await Appointment.find({Appointment_User_Chosen_Doctor : req.params.id});
         const patients = await Patient.find({});
        res.render('doctor/patient', {
          layout: 'layouts/doctorModule',
          data,
          appointments,
          patients,
          helper: require("../middleware/helper"),
        });
      } catch (err) {
        res.redirect(302 , '/error/500');
      }
  })
  
  
  router.get('/doctor/nurse/panel', NotAuthDoctor, async(req,res)=>{
    try {
      const staffs = await Staff.find({});
      const doctors = await Doctor.findById(req.session.user);
      res.render('doctor/staff', {
        layout: 'layouts/doctorModule',
        staffs,
        helper: require("../middleware/helper"),
        data: doctors
      });
    } catch (err) {
      res.redirect(302 , '/error/500');
    }
  });
  
  
  router.get('/doctor/department/panel', NotAuthDoctor, async(req, res)=>{
    try {
      const doctors = await Doctor.find({});
      const staffs = await Staff.find({});
      const data = await Doctor.findById(req.session.user);
      res.render('department',
       {
       layout : 'layouts/doctorModule' ,
       doctors, 
       value : 0 ,
       staffs,
       data,
       helper: require("../middleware/helper"),
      });
    } catch (err) {
      res.redirect(302 , '/error/500');
    }
  });
  
  router.get('/doctor/bed/panel', NotAuthDoctor, async(req,res)=>{
    try {
      const doctors = await Doctor.findById(req.session.user);
      res.render('partials/nullPage', {
        layout: 'layouts/doctorModule',
        helper: require("../middleware/helper"),
        data: doctors
      });
    } catch (err) {
      res.redirect(302 , '/error/500');
    }
  });
  
  router.get('/doctor/bloodbank/panel', NotAuthDoctor, async(req,res)=>{
    try {
      const doctors = await Doctor.findById(req.session.user);
      res.render('partials/nullPage', {
        layout: 'layouts/doctorModule',
        helper: require("../middleware/helper"),
        data: doctors
      });
    } catch (error) {
      res.redirect(302 , '/error/500');
    }
  });

module.exports = router;

  