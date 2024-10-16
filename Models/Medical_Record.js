const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MedicalRecordSchema = new Schema(
  {
    card_no: { type: String, ref: 'patients', required: true },
    diagnosis: { type: String, required: true },
    symptoms: { type: String, required: true },
    treatments: { type: String, required: true },
    follow_up_info: { type: String, required: true },
    medications: [{ type: String, ref: 'medications', required: true }],
    lab: { type: String, ref: 'labs' },
    doctor: { type: String, ref: 'doctors', required: true }
  },
  { timestamps: true }
)

MedicalRecordSchema.pre('find', function () {
  this.populate('card_no', ['card_no'])
  this.populate({
    path: 'doctor',
    populate: { path: 'emp_id', select: ['first_name', 'last_name'] },
    select: 'speciality'
  })
  this.populate('lab')
})
MedicalRecordSchema.pre('findOne', function () {
  this.populate('card_no', ['card_no'])
  this.populate({
    path: 'doctor',
    populate: { path: 'emp_id', select: ['first_name', 'last_name'] },
    select: 'speciality'
  })
  this.populate('lab')
})

const MedicalRecord = mongoose.model('medicalRecords', MedicalRecordSchema)
module.exports = MedicalRecord
