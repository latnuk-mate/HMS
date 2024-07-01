
const { Appointment } = require("../Model/appointment");
const { Doctor } = require("../Model/doctor");
const upload = require("../middleware/fileSave");
const { NotAuthUser, NotAuthAdmin, NotAuthDoctor } = require("../middleware/userAuth");

const router = require("express").Router();


router.get("/dashboard", NotAuthUser, (req, res) => {
  res.render("layouts/PatientModule", { user: req.user.userName });
});

router.get("/user/appointment", async(req, res) => {
  try{
    const data = await Doctor.find({});
    res.render("appointment", {doctors : data});
 }catch(err){
   res.sendStatus(500).json(err);
 }
});

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

router.get('/admin/appointment/panel/:query?', async(req, res)=>{
  try {
    const apponitments = await Appointment.find({});
    res.render('admin/appointment', 
      {layout : 'layouts/adminModule', 
      query : req.params.query, 
      appointments : apponitments,
      length : 0});

} catch (error) {
    res.sendStatus(500).json(error); 
}
});

router.get('/user/appointment/confirmed/:id', async(req, res)=>{
  const app_id = req.params.id;
  try{
    const app_data = await Appointment.findById(app_id);
    app_data.Appointment_Status = "confirmed";
    await Appointment.create(app_data);
    res.redirect(302, '/admin/appointment/panel');
  }catch(err){
    res.sendStatus(500).json(err);
  }
});

router.get('/user/appointment/cancel/:id', async(req,res)=>{
  const app_id = req.params.id;
  try{
    await Appointment.findByIdAndDelete(app_id, (err)=>{
      if(err){
        res.sendStatus(500).json(err);
      }else{
        res.redirect(302, '/admin/appointment/panel'); 
      }
    });
   
  }catch(err){
    res.sendStatus(500).json(err);
  }
})

router.post("/appointment/create", async(req, res) => {
  const {
      patientName, 
      patientAge,
      patientEmail, 
      patientDob,  phone,
      doctor, date, health 
    } = req.body;

  try {
    const data = await Appointment.create({
      Appointment_User_Name: patientName,
      Appointment_User_Age: patientAge,
      Appointment_User_Email: patientEmail,
      Appointment_User_Dob: patientDob,
      Appointment_User_Phone: phone,
      Appointment_User_Chosen_Doctor: doctor,
      Appointment_User_Book_Date: date,
      Appointment_User_Health: health
    });
    await data.save();
    res.redirect(302, '/admin/appointment/panel');
} catch (error) {
    res.sendStatus(500).json(error);
}
});

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
                        DoctorHours1: req.body.doctorHours1,
                        DoctorHours2: req.body.doctorHours2,
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

// doctors module pages...

router.get('/doctor/dashboard/:id?', NotAuthDoctor,  async(req, res)=>{
  const doctorId = req.params.id;
  try {
    const doctorData = await Doctor.findById(doctorId);
    res.render('doctor/dashboard', {layout: 'layouts/doctorModule', data: doctorData});
  } catch (error) {
    res.sendStatus(500).json(error);
  }
})

module.exports = router;
