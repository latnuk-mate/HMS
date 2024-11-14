// doctors module pages functions...
const router = require("express").Router();
const { Appointment } = require("../Model/appointment");
const { Doctor } = require("../Model/doctor");
const { Patient } = require("../Model/patient");
const { Staff } = require("../Model/staff");


async function findDoctorById(id){ 
  try {
    const doctor = await Doctor.findById(id);

      if(!doctor){
        throw Error('No Data found!');
      }

      return doctor;
  } catch (err) {
      console.log(err.message);
  }
}

async function findData(module){
    let data;
    try {
      switch(module){
        case "patient":
          data = await Patient.find({})
          return data;
        case "doctor":
          data = await Doctor.find({});
          return data;
        case 'appointment':
          data = await Appointment.find({});
          return data;
        case 'staff':
          data = await Staff.find({});
          return data;
        default:
          return null;
  
      }
    } catch (err) {
        console.error(err.code)
    }
}

// all the routes...
router.get('/dashboard/:id',  async(req, res)=>{
    const doctorId = req.params.id;
    try {
      
      const patientData = await findData('patient');
      const doctors = await findData('doctor');
      const doctorData = await findDoctorById(doctorId);
      const appointments = await findData('appointment');
      res.render('doctor/dashboard',
       { layout: 'layouts/doctorModule',
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
  
  router.get('/accounts/:id', async(req,res)=>{
    const doctorId = req.params.id;
    try {
      const doctorData = await findDoctorById(doctorId);
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


router.post('/pass/update/:id',   async(req,res)=>{
  const { newPass, oldPass } = req.body;
  const id = req.params.id;
    try {
      const doctor = await findDoctorById(id);
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
        res.redirect(302 , '/error/500');
      }

    } catch (error) {
      res.redirect(302, '/error/500');
    }
})


  
  router.get('/appointment/panel/:id/:query?', async(req, res)=>{
    const query = req.params.query;
  
    try {
      const doctors = await findDoctorById(req.params.id);
      const apponitments = await findData('appointment');
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
  
  router.get('/appointment/confirmed/:id', async(req, res)=>{
    const app_id = req.params.id;
    const id = req.session.user;
    try{
      const app_data = await Appointment.findById(app_id);
      app_data.Appointment_Status = "approved";
      await Appointment.create(app_data);
      res.redirect(302, `/doctor/appointment/panel/${id}`);
    }catch(err){
      res.redirect(302 , '/error/500');
    }
  });
  
  router.get('/appointment/cancel/:id', async(req,res)=>{
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
  
  router.get('/patient/panel/:id', async(req,res)=>{
      try {
        const data = await findDoctorById(req.params.id);
         const appointments = await Appointment.find({Appointment_User_Chosen_Doctor : req.params.id});
         const patients = await findData('patient');
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
  
  
  router.get('/nurse/panel', async(req,res)=>{
    try {
      const staffs = await findData('staff');
      const doctors = await findDoctorById(req.session.user);
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
  
  
  router.get('/department/panel', async(req, res)=>{
    try {
      const doctors = await findData('doctor');
      const staffs = await findData('staff');
      const data = await findDoctorById(req.session.user);
      res.render('department',
       {
       layout : 'layouts/doctorModule',
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
  
  router.get('/bed/panel', async(req,res)=>{
    try {
      const doctors = await findDoctorById(req.session.user);
      res.render('partials/nullPage', {
        layout: 'layouts/doctorModule',
        helper: require("../middleware/helper"),
        data: doctors
      });
    } catch (err) {
      res.redirect(302 , '/error/500');
    }
  });
  
  router.get('/bloodbank/panel', async(req,res)=>{
    try {
      const doctors = await findDoctorById(req.session.user);
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

// doctor module is done!

  