const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmployeeSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: { type: String,default:"https://res.cloudinary.com/df9o0bto4/image/upload/v1686672390/userAvatars/1686672389691.png",required:true},
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: [{ type: String, required: true }],
  address: { type: String, required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'hospitals', required: true },
  status: {
    type: String,
    enum: ['available', 'leave', 'break']
  },
  staff_type: { type: String, required: true, enum: ['permanent', 'contract'] },
  role: { type: String, required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'branches', required: true },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments',
    required: true
  }
})

EmployeeSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  return obj
}

EmployeeSchema.pre('find', function () {
  this.populate({
    path: 'branch',
    select: ['name', 'address']
  })
  this.populate({ path: 'hospital' })
  this.populate({ path: 'department' })
} )

EmployeeSchema.pre('findOne', function () {
  this.populate({
    path: 'branch',
    select: ['name', 'address']
  })
  this.populate({ path: 'hospital' })
  this.populate({ path: 'department' })
})

const Employee = mongoose.model('employees', EmployeeSchema)
module.exports = Employee
