// Patient Page...

const { Appointment } = require("../Model/appointment");
const { Doctor } = require("../Model/doctor");
const { Patient } = require("../Model/patient");
const {formatTime, calculateAge} = require("../middleware/helper");
const { NotAuthUser} = require("../middleware/userAuth");

const router = require("express").Router();


router.get("/dashboard", NotAuthUser, async(req, res) => {
  try {
      const doctors = await Doctor.find({});
      const appointments = await Appointment.find({Appointment_Patient : req.user.id});
      const patients = await Patient.find({});
      res.render("patient/dashboard", { 
        layout: 'layouts/PatientModule',
        helper: require("../middleware/helper"),
        patient: req.user,
        doctors,
        appointments,
        patients,
        notification : 0
      });
  } catch (error) {
      res.sendStatus(500).json(error.message);
  }
});

router.get('/patient/appointment/panel/:id', NotAuthUser, async(req,res)=>{
  try {
    const appointments = await Appointment.find({Appointment_Patient : req.params.id});
    const doctors = await Doctor.find({});
    res.render('patient/appointment', {
      layout: 'layouts/patientModule',
      appointments,
      doctors,
      patient: req.user,
      helper: require("../middleware/helper"),
      notification : 0
    });
  } catch (err) {
     res.sendStatus(500).json({err});

  }
})


router.get("/patient/appointment/create", NotAuthUser, async(req, res) => {
  try{
    const data = await Doctor.find({});
    const appointments = await Appointment.find({Appointment_Patient : req.user.id});
    res.render("appointment", {
      layout: 'layouts/patientModule',
      patient: req.user,
      doctors : data,
      appointments,
      helper: require("../middleware/helper"),
      notification : 0
    });
 }catch(err){
   res.sendStatus(500).json(err);
 }
});

router.post("/patient/appointment/save", async(req, res) => {
  const {
      patientName,
      patientEmail, 
      patientDob,  phone,
      doctor, date, time, health 
    } = req.body;

  try {
      const data = await Appointment.create({
        Appointment_User_Name: patientName,
        Appointment_User_Age: calculateAge(patientDob),
        Appointment_User_Email: patientEmail,
        Appointment_User_Dob: patientDob,
        Appointment_User_Phone: phone,
        Appointment_User_Chosen_Doctor: doctor,
        Appointment_User_Book_Date: date,
        Appointment_User_Book_Time: formatTime(time),
        Appointment_User_Health: health,
        Appointment_Patient: req.user.id,
        createdAt: new Date()
      });
      await data.save();
      res.redirect(302, `/patient/appointment/panel/${req.user.id}`);

} catch (error) {
    res.sendStatus(500).json(error);
}
});


router.get('/patient/appointment/cancel/:id', async(req,res)=>{
  const app_id = req.params.id;
  const id = req.user.id;
  try{
    await Appointment.findByIdAndDelete(app_id, (err)=>{
      if(err){
        res.sendStatus(500).json(err);
      }else{
        res.redirect(302, `/patient/appointment/panel/${id}`);
      }
    });
   
  }catch(err){
    res.sendStatus(500).json(err);
  }
})

router.get('/patient/doctor/panel/:id' , NotAuthUser, async(req, res)=>{
  try {
    const doctors = await Doctor.find({});
    const appointments = await Appointment.find({Appointment_Patient : req.params.id});
    res.render('patient/doctorPage', {
      layout: 'layouts/patientModule',
      patient: req.user,
      helper: require("../middleware/helper"),
      doctors,
      appointments,
      notification : 0
    })
  } catch (e) {
      res.sendStatus(500).json(e.message);
  }
})



router.get('/patient/account/delete/:id', NotAuthUser, async(req, res)=>{
  const id = req.params.id;
  try {
      await Patient.findByIdAndDelete(id, (err)=>{
        if(err){
          res.sendStatus(500).json({err})
        }
        res.redirect(302, '/user/login');
      });
  } catch (error) {
    res.sendStatus(500).json(error.message);
  }
})


module.exports = router;
