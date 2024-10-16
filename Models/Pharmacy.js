const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PhamarcySchema = {
  name: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  emp_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'employee'
    }
  ],
  branch_id:{
    type: Schema.Types.ObjectId,
    ref: 'branches'
  },
  drug_id: [{ type: Schema.Types.ObjectId, ref: 'drugs' }]
}

const Phamarcy = mongoose.model('pharmacies', PhamarcySchema)
module.exports = Phamarcy
