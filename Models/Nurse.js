const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NurseSchema = new Schema({
  emp_id: { type: Schema.Types.ObjectId, ref: 'employees', required: true },
  ward_no: [{ type: Schema.Types.ObjectId, ref: 'wards', required: true }],
  patients_incharge_of: [
    { type: Schema.Types.ObjectId, ref: 'patients' }
  ],
  branch_id: { type: Schema.Types.ObjectId, ref: 'branches', required: true }
})

NurseSchema.pre('find', function () {
  this.populate({ path: 'emp_id' })
  this.populate({ path: 'ward_no', select: ['name', 'type'] })
  this.populate({
    path: 'patients_incharge_of',
    select: ['card_no', 'emergency_contact']
  })
  this.populate({
    path: 'branch_id',
    populate: { path: 'hospital', select: ['name', 'prefix'] },
    select: ['name', 'address']
  })
})
NurseSchema.pre('findOne', function () {
  this.populate({ path: 'emp_id' })
  this.populate({ path: 'ward_no', select: ['name', 'type'] })
  this.populate({
    path: 'patients_incharge_of',
    select: ['card_no', 'emergency_contact']
  })
  this.populate({
    path: 'branch_id',
    populate: { path: 'hospital', select: ['name', 'prefix'] },
    select: ['name', 'address']
  })
})

const Nurse = mongoose.model('nurses', NurseSchema)
module.exports = Nurse
