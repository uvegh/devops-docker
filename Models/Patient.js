const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatientSchema = new Schema(
  {
    card_no: { type: Number, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    avatar: { type: String, default:"img/user.png",required:true},
    gender: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    d_o_b: { type: Date, required: true },
    phone: [{ type: String, required: true }],
    address: { type: String, required: true },
    city: { type: String},
    state: { type: String},
    occupation: { type: String, required: true },
    type_of_patient: { type: String },
    allergies: { type: String },
    insurance: { type: String },
    status: { type: String, default: 'Outpatient' },
    vitals: {
      blood_group: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
      },
      blood_pressure: { type: String },
      weight: { type: String },
      height: { type: String },
      temperature: { type: String },
      heart_rate: { type: String },
      respiratory_rate: { type: String },
      pulse: { type: String }
     
    },
    emergency_contact: {
      first_name: { type: String },
      last_name: { type: String },
      phone: [{ type: String }],
      email: { type: String }
     
    }
  },
  { timestamps: true }
)

// Define a pre-save hook to increment the CARD_NO field
PatientSchema.pre('save', async function () {
  const count = await mongoose
    .model('patients', PatientSchema)
    .countDocuments()
    .exec()
  this.card_no = count + 1
})

PatientSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  return obj
}

const Patient = mongoose.model('patients', PatientSchema)

module.exports = Patient
