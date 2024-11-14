// Admin page 

const multer = require('multer');
const upload = require('../middleware/fileSave');
const { formatTime } = require('../middleware/helper');
const { Appointment } = require('../Model/appointment');
const { Doctor } = require('../Model/doctor');
const { Patient } = require('../Model/patient');
const { Staff } = require('../Model/staff');

const router = require('express').Router();



router.get("/dashboard", async(req, res) => {
  try {
        const patients = await Patient.find({});
        const appointments  = await Appointment.find({});
        const staffs = await Staff.find({});

      res.render("admin/dashboard", 
        { 
          layout: "layouts/adminModule",
          patients,
          appointments,
          staffs,
          count : 0
         });

  } catch (error) {
    res.redirect(301, '/error/500')
  }
    
  });
  
  router.get("/doctor/panel", async(req, res) => {
    try{
       const data = await Doctor.find({});
      res.render("admin/doctors", { layout: "layouts/adminModule" , doctors : data});
    }catch(err){
      res.redirect(301, '/error/500')
    }
     
  });
  


  router.get("/create/doctor/profile", (req, res) => {
    try {
      res.render("admin/doctorProfileForm", 
        {
          layout: "layouts/adminModule",
          doctor: {}
        });
    } catch (error) {
      res.redirect(301, '/error/500')
    } 
  });


  
  router.get('/department/panel', async(req, res)=>{
    try {
        const data = await Doctor.find({});
        res.render('department', {layout : 'layouts/adminModule' , doctors : data , value : 0 , staffs : []});
    } catch (error) {
      res.redirect(301, '/error/500')
    }
  });
  
  // admin Staff Panel design...
  
  router.get('/staff/panel', async(req, res)=>{
    try {
      const staffs = await Staff.find({});
      res.render('admin/staffPanel', {
        layout: 'layouts/adminModule',
        staffs,
        helper: require("../middleware/helper"),
      })
    } catch (error) {
      res.redirect(301, '/error/500')
    }
  });
  
  router.get('/staff/create', async (req,res)=>{
    try {
      res.render('admin/staffForm', {
        layout: 'layouts/adminModule'
      })
    } catch (err) {
      res.redirect('/error/500')
    }
  });


  
  router.post('/staffProfileSave', async(req, res)=>{
    const {category, name, email, phone, shiftTime, empDate } = req.body;
    try {
        const data = await Staff.create({
          Category: category,
          Name: name,
          Email : email,
          Phone: phone,
          Shift: shiftTime,
          EmpDate : empDate
        });
  
        await data.save();
        res.redirect(302, '/admin/staff/panel');
    } catch (err) {
        if(err.code === 11000){
          res.render('admin/staffForm', {
            layout: 'layouts/adminModule',
            msg: "Email already in use!"
          })
        }else{
         res.sendStatus(500).json("service unavaiable!")  
        }  
    }
  });


  
  router.post('/search/query', async(req, res)=>{
    const {query} = req.body;
    try {
        const filteredData = await Staff.find({
          $or:[
            { Category: query },
            { Name: query }
          ]
      });

      res.render('admin/staffPanel', {
        layout: 'layouts/adminModule',
        staffs : filteredData,
        helper: require("../middleware/helper"),
      })
    } catch (err) {
      res.redirect(301, '/error/500')
    }
  })


  
  router.get('/appointment/panel', async(req, res)=>{
    try {
      const patients = await Patient.find({});
      const doctors = await Doctor.find({});
      const appointments = await Appointment.find({});
      res.render('admin/appointment', 
        {layout : 'layouts/adminModule', 
          appointments,
          patients,
          doctors,
          helper: require("../middleware/helper"),
       });
  
  } catch (error) {
      res.redirect(301, '/error/500')
  }
  });
  
  

  router.post("/doctor/profile/save", (req, res) => {
    upload(req, res , async(err)=>{
      if(err instanceof multer.MulterError){
        if(err.code === 'LIMIT_FILE_SIZE'){
            res.render("admin/doctorProfileForm",
            { layout: "layouts/adminModule" , msg: 'file is too large, should not exceed 3mb', doctor: {}});
         }
         else{
          res.render("admin/doctorProfileForm",
            { layout: "layouts/adminModule" , msg: err, doctor: {}});
         }
      }else{
          if(req.file == undefined){
              res.render("admin/doctorProfileForm", 
            { layout: "layouts/adminModule" , msg: "Please select a file!", doctor: {}});
          }else{
                  try{
                      const doctorData = await Doctor.create({
                          Name : req.body.doctorName,
                          Email : req.body.doctorEmail,
                          Phone : req.body.doctorPhone,
                          Date1 : req.body.doctorDate1,
                          Date2 : req.body.doctorDate2,
                          Image:  {
                            fileName: req.file.originalname,
                            fileContentType: req.file.mimetype,
                            fileData: req.file.buffer
                          },
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
                      res.render("admin/doctorProfileForm", 
                      { layout: "layouts/adminModule" , msg: err.message, doctor: {}});
                  }
  
          }};
  });
  
  });



  router.get('/doctorProfile/view/:id',    async(req,res)=>{
    try {
      const doctor = await Doctor.findById(req.params.id);
      res.render('partials/doctorInfo', {
        layout: 'layouts/adminModule',
        doctor
      });
    } catch (error) {
      res.redirect(301, '/error/500')
    }
  })

  router.get('/accounts/panel', (req,res)=>{
    try {
      res.render('partials/nullPage', {
        layout: 'layouts/adminModule'
      });
    } catch (error) {
      res.redirect(301, '/error/500')
    }
  });


  router.get('/bed/panel', (req,res)=>{
    try {
      res.render('partials/nullPage', {
        layout: 'layouts/adminModule'
      });
    } catch (error) {
      res.redirect(301, '/error/500')
    }
  });
  
  router.get('/bloodbank/panel', (req,res)=>{
    try {
      res.render('partials/nullPage', {
        layout: 'layouts/adminModule',
      });
    } catch (error) {
      res.redirect(301, '/error/500')
    }
  });


  module.exports = router;


  // admin module is done!