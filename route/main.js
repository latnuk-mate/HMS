
const { Doctor } = require("../Model/doctor");
const upload = require("../middleware/fileSave");
const { NotAuthUser, NotAuthAdmin } = require("../middleware/userAuth");

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
})

router.post("/appointment", (req, res) => {
  const { patientName, phone, doctors, date, health } = req.body;
  res.json({ patientName, phone, doctors, date, health });
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
                        Department : req.body.doctorDepartment,
                        Date1 : req.body.doctorDate1,
                        Date2 : req.body.doctorDate2,
                        Image:  req.file.filename,
                        createdAt : new Date()
                    });

                    await doctorData.save();
                    res.redirect(302 , '/admin/doctor/panel');
                }
                catch(err){
                    res.render("admin/doctorProfileForm", { layout: "layouts/adminModule" , msg: "Email is already taken! Use another"});
                }

        }};
});
     



});

module.exports = router;
