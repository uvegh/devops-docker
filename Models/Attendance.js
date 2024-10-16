
const mongoose=require('mongoose')
const Schema=mongoose.Schema



const AttendanceSchema=new Schema({
    emp_id:{type:Schema.Types.ObjectId,ref:'employees',required:true},
sign_in:{type:String},
notes:{type:String},
sign_out:{type:String},



},{timestamps:true})

const Attendance=mongoose.model('attendance',AttendanceSchema)
module.exports=Attendance