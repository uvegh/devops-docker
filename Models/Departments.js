const mongoose = require('mongoose');
const departmentSchema = mongoose.Schema({
  name:{type:String, required:true},
  head_of_dept:{type:String, required:true, ref:'employees'},
  branch_id :{type:String, required:true, ref:'branches'},
})

const Department = mongoose.model('departments', departmentSchema)
module.exports = Department