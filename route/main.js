
const { Appointment } = require("../Model/appointment");
const { Doctor } = require("../Model/doctor");
const { Patient } = require("../Model/patient");
const upload = require("../middleware/fileSave");
const {formatTime, calculateAge, saveNotification} = require("../middleware/helper");
const { NotAuthUser, NotAuthAdmin, NotAuthDoctor } = require("../middleware/userAuth");

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
    // res.sendStatus(500).json({err});
    console.log(err.message)
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
    // res.sendStatus(500).json(error);
    console.log(error.message)
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




router.get("/admin/dashboard", NotAuthAdmin, (req, res) => {
  res.render("admin/dashboard", { layout: "layouts/adminModule" });
});

router.get("/admin/doctor/panel",  NotAuthAdmin, async(req, res) => {
  try{
     const data = await Doctor.find({});
  res.render("admin/doctors", { layout: "layouts/adminModule" , doctors : data});
  }catch(err){
    res.sendStatus(500).json(err);
  }
   
});

router.get("/create/doctor/profile", NotAuthAdmin, (req, res) => {
  res.render("admin/doctorProfileForm", { layout: "layouts/adminModule" });
});

router.get('/admin/department/panel', NotAuthAdmin, async(req, res)=>{
  try {
      const data = await Doctor.find({});
      res.render('admin/department', {layout : 'layouts/adminModule' , doctors : data , value : 0 , staffs : []});
  } catch (error) {
      res.sendStatus(500).json(error);
  }
});

// router.get('/admin/appointment/panel/:query?', async(req, res)=>{
//   try {
//     const apponitments = await Appointment.find({});
//     res.render('admin/appointment', 
//       {layout : 'layouts/adminModule', 
//       query : req.params.query, 
//       appointments : apponitments,
//       length : 0});

// } catch (error) {
//     res.sendStatus(500).json(error); 
// }
// });


router.post("/doctor/profile/save", (req, res) => {

  upload(req, res , async(err)=>{
    if(err){
        res.render("admin/doctorProfileForm", { layout: "layouts/adminModule" , msg: err});
    }else{
      
        if(req.file == undefined){
            res.render("admin/doctorProfileForm", { layout: "layouts/adminModule" , msg: "Please select a file!"});
        }else{
                try{
                    const doctorData = await Doctor.create({
                        Name : req.body.doctorName,
                        Email : req.body.doctorEmail,
                        Phone : req.body.doctorPhone,
                        Date1 : req.body.doctorDate1,
                        Date2 : req.body.doctorDate2,
                        Image:  req.file.filename,
                        License: req.body.doctorLicense,
                        Academics: req.body.doctorAcademics,
                        Speciality: req.body.doctorSpeciality,
                        sub_Speciality: req.body.doctorSubSpeciality,
                        EmploymentField: req.body.doctorEmploymentArea,
                        Department : req.body.doctorDepartment,
                        EmploymentStatus: req.body.doctorEmploymentStatus,
                        EmploymentDate: req.body.EmpDate,
                        DoctorHours1: formatTime(req.body.doctorHours1),
                        DoctorHours2: formatTime(req.body.doctorHours2),
                        DoctorFee: req.body.doctorFee,
                        userName: req.body.doctorUser,
                        Password: req.body.doctorPass,
                        createdAt : new Date()
                    });

                    await doctorData.save();
                    res.redirect(302 , '/admin/doctor/panel');
                }
                catch(err){
                    res.render("admin/doctorProfileForm", { layout: "layouts/adminModule" , msg: err.message});
                }

        }};
});

});




// doctors module pages functions...
router.get('/doctor/dashboard/:id', NotAuthDoctor,  async(req, res)=>{
  const doctorId = req.params.id;
  try {
    
    const patientData = await Patient.find({});
    const doctors = await Doctor.find({});
    const doctorData = await Doctor.findById(doctorId);
    const appointments = await Appointment.find({});
    res.render('doctor/dashboard',
     {layout: 'layouts/doctorModule',
       data: doctorData,
       helper: require("../middleware/helper"),
       doctors,
       patientData,
       appointments,
      });
  } catch (error) {
    res.sendStatus(500).json(error);
  }
});

router.get('/doctor/accounts/:id', async(req,res)=>{
  const doctorId = req.params.id;
  try {
    const doctorData = await Doctor.findById(doctorId);
    res.render('doctor/profile', 
      {layout: 'layouts/doctorModule',
         data: doctorData, 
         helper: require("../middleware/helper")
      });

  } catch (error) {
    res.sendStatus(500).json(error);
  }
});

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
    res.sendStatus(500).json(error); 
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
    // res.sendStatus(500).json(err);
    console.log(err.message)
  }
});

router.get('/user/appointment/cancel/:id', async(req,res)=>{
  const app_id = req.params.id;
  const id = req.session.user;
  try{
    await Appointment.findByIdAndDelete(app_id, (err)=>{
      if(err){
        res.sendStatus(500).json(err);
      }else{
        res.redirect(302, `/doctor/appointment/panel/${id}`);
      }
    });
   
  }catch(err){
    res.sendStatus(500).json(err);
  }
})








module.exports = router;
