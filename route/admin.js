// Admin page 

const upload = require('../middleware/fileSave');
const { formatTime } = require('../middleware/helper');
const { NotAuthAdmin } = require('../middleware/userAuth');
const { Appointment } = require('../Model/appointment');
const { Doctor } = require('../Model/doctor');
const { Patient } = require('../Model/patient');
const { Staff } = require('../Model/staff');

const router = require('express').Router();



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
        res.render('department', {layout : 'layouts/adminModule' , doctors : data , value : 0 , staffs : []});
    } catch (error) {
        res.sendStatus(500).json(error);
    }
  });
  
  // admin Staff Panel design...
  
  router.get('/admin/staff/panel', NotAuthAdmin, async(req, res)=>{
    const staffs = await Staff.find({});
    res.render('admin/staffPanel', {
      layout: 'layouts/adminModule',
      staffs,
      helper: require("../middleware/helper"),
    })
  });
  
  router.get('/admin/staff/create', NotAuthAdmin , async (req,res)=>{
    res.render('admin/staffForm', {
      layout: 'layouts/adminModule'
    })
  });
  
  router.post('/admin/staffProfileSave', async(req, res)=>{
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
        res.sendStatus(500).json(err);
    }
  });
  
  router.post('/search/query', async(req, res)=>{
    const {query} =   req.body;
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
        res.sendStatus(500).json(err);
    }
  })
  
  router.get('/admin/appointment/panel', async(req, res)=>{
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



  router.get('/admin/bed/panel', NotAuthAdmin, (req,res)=>{
    try {
      res.render('partials/nullPage', {
        layout: 'layouts/adminModule'
      });
    } catch (error) {
        res.sendStatus(500).json(error);
    }
  });
  
  router.get('/admin/bloodbank/panel', NotAuthAdmin, (req,res)=>{
    try {
      res.render('partials/nullPage', {
        layout: 'layouts/adminModule',
      });
    } catch (error) {
        res.sendStatus(500).json(error);
    }
  });


  module.exports = router;