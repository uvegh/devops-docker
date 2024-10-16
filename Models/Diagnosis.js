const mongoose = require('mongoose');
const diagnosisSchema = mongoose.Schema({
  first_name:{type:String, required:true},
  last_name:{type:String, required:true},
  patient_dob:{type:Date},
  date_of_diagnosis:{type:Date},
  symptoms: {type:String, required:true},
  diagnosis: {type:String, required:true},
  doctor_name: {type:String, ref:'employees', required:true},
  doctor_initials:{type:String, required:true}
})

const Diagnosis = mongoose.model("diagnosis", diagnosisSchema);

module.exports = Diagnosis;