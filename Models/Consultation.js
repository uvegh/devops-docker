const mongoose = require('mongoose');
const consultationSchema = mongoose.Schema({
  patient_id:{type:String, ref:'patients'},
  employees_id:{type:String, ref:'employees'},
  payment_status:{type:String, enum:['paid','notpaid', 'pending']},
  diagnosis:{type:String},
  prescription:{type:String},
  medication_id:{type:String},
  doctor_seen:{type:Boolean,default:false,required:true},
  nurse_seen:{type:Boolean,default:false,required:true}
},{timestamps:true})

const Consultation = mongoose.model('consultations', consultationSchema)

module.exports = Consultation