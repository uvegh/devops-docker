const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceptionistSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'employees', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'branches', required: true }
})

const Receptionist = mongoose.model('receptionists', ReceptionistSchema)
module.exports = Receptionist
