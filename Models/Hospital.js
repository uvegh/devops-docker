const mongoose = require('mongoose')
const hospitalSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  cac_no: { type: String },
  organization: { type: String, required: true },
  pharmacy: [{ type: String, ref: 'pharmacies' }],
  prefix: { type: String }
})

const Hospital = mongoose.model('hospitals', hospitalSchema)
module.exports = Hospital
