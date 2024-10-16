const mongoose=require('mongoose')
const Schema=mongoose.Schema

const LabReportSchema=mongoose.Schema({	
lab_id:{
    type:Schema.Types.ObjectId,ref:"labs",required:true
},
description:{
    type:String,required:true
},
patient_id:{
    type:Schema.Types.ObjectId,ref:"patients",required:true
},
	emp_id:{
        type:Schema.Types.ObjectId,ref:"employees",required:true
    },
	attarchment :{type:String}

},{timestamps:true})

const LabReport=mongoose.model('labReports',LabReportSchema)
module.exports=LabReport