const mongoose = require('mongoose')


const AppointmentSchema = new mongoose.Schema({
    Appointment_Status: {
        type: String,
        default : "pending"
    },
    Appointment_User_Name: {
        type: String,
        required : true
    },
    Appointment_User_Age:{
        type: Number,
        required: true
    },
    Appointment_User_Email : {
        type: String,
        unique: true,
        required : true
    },
    Appointment_User_Dob:{
        type: Date,
        required: true
    },
    Appointment_User_Phone:{
        type : Number,
        required: true
    },
    Appointment_User_Chosen_Doctor:{
        type: String,
        required: true
    },
    Appointment_User_Book_Date:{
        type: Date,
        required: true
    },
    
    Appointment_User_Book_Time:{
        type: String,
        required: true
    },
    Appointment_User_Health:{
        type: String,
        required: true
    },
    Appointment_Patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Patient'
      },
    createdAt:{
        type: Date,
        default : Date.now()
    }
});

module.exports.Appointment = mongoose.model("Appointment" , AppointmentSchema);