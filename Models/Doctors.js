const mongoose = require('mongoose')
const doctorSchema = mongoose.Schema({
  emp_id: { type: String, ref: 'employees', required: true },
  speciality: { type: String, required: true },
  branch_id: { type: String, ref: 'branches', required: true }
})

doctorSchema.pre('find', function () {
  this.populate({ path: 'emp_id' })
  this.populate({
    path: 'branch_id',
    populate: { path: 'hospital', select: ['name', 'prefix'] },
    select: ['name', 'address']
  })
})
doctorSchema.pre('findOne', function () {
  this.populate({ path: 'emp_id' })
  this.populate({
    path: 'branch_id',
    populate: { path: 'hospital', select: ['name', 'prefix'] },
    select: ['name', 'address']
  })
})

const Doctor = mongoose.model('doctors', doctorSchema)
module.exports = Doctor
