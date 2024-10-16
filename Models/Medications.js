const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MedicationSchema = new Schema(
  {
    is_collected: { type: String, required: true, enum: ['yes', 'no'] },
    card_no: { type: Schema.Types.ObjectId, ref: 'patients', required: true },
    medications: { type: String, required: true },
    dosage: { type: String, required: true },
    freq: { type: String, required: true }
  },
  { timestamps: true }
)

MedicationSchema.pre('find', function () {
  this.populate({ path: 'card_no', select: ['card_no'] }).exec()
})
MedicationSchema.pre('findOne', function () {
  this.populate({ path: 'card_no', select: ['card_no'] }).exec()
})

const Medication = mongoose.model('medications', MedicationSchema)
module.exports = Medication
