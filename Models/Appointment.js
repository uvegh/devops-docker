const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppointmentSchema = new Schema(
  {
    card_no: { type: Schema.Types.ObjectId, ref: 'patients', required: true },
    physician: { type: Schema.Types.ObjectId, ref: 'employees', required: true },
    notes: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['booking', 'rescheduled', 'confirmed', 'declined', '']
    },
    date:{type:String,required:true},
    time:{type:String,required:true},
    doctor_seen:{type:Boolean,required:true,default:false},
    nurse_seen:{type:Boolean,default:false,required:true},
    payment_status:{type:Boolean,default:false,required:true}
  },
  { timestamps: true }
)

AppointmentSchema.pre('find', function () {
  this.populate({ path: 'card_no', select: ['card_no','first_name','last_name','gender','vitals'] })
  this.populate({path: 'physician',select: ['first_name', 'last_name','status'] 
})
})
AppointmentSchema.pre('findOne', function () {
  this.populate({ path: 'card_no', select: ['card_no','first_name','last_name','gender'] })
  this.populate({path: 'physician',select: ['first_name', 'last_name','status'] 
  })
})

const Appointment = mongoose.model('appointments', AppointmentSchema)
module.exports = Appointment
