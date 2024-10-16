require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
// Port in Use
const PORT = 3001

// Setting up the Mongodb connection
const DBConnection = require('./config/DBConnection')
const passport=require('passport')
// calling the DATABASE
 var userProfile

 
DBConnection()
passport.serializeUser(function(user,cb){
  cb(null,user)
})

passport.deserializeUser(function(user,cb){
  cb(null,user)
})

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://crg3lr-3000.csb.app/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
app.use('/img',express.static('img'))

// built in middleware to handle urlencoded form-dara
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

// built in middleware for json
app.use(express.json({ limit: '100mb' }))
app.use(cors())
// routes
app.use('/employee', require('./routes/Employee'))
app.use('/admin', require('./routes/Admin'))
app.use('/patient', require('./routes/Patient'))
app.use(
  '/register',
  require('./routes/UserRegister'),
  require('./routes/EmployeeRegister')
)
app.get('/', (req, res) => {
  res.send('Welcome to GAVO HMS')
})
app.use('/auth', require('./routes/EmployeeAuth'), require('./routes/UserAuth'))
app.use('/hospital', require('./routes/Hospital'))
app.use('/branch', require('./routes/Branch'))
app.use('/department', require('./routes/Department'))
app.use('/labReport', require('./routes/LabReport'))
app.use('/doctor', require('./routes/Doctor'))
app.use('/nurse', require('./routes/Nurse'))
app.use('/lab', require('./routes/Lab'))
app.use('/record', require('./routes/MedicalRecords'))
app.use('/receipt', require('./routes/Receipt'))
app.use('/ward', require('./routes/Ward'))
app.use('/bed', require('./routes/Bed'))
app.use('/drugs', require('./routes/Drug'))
app.use('/appointment', require('./routes/Appointment'))
app.use('/pharmacy',require('./routes/Pharmacy'))
app.use('/pharmacist', require('./routes/Phamacist'))
app.use('/medication', require('./routes/Medications'))
app.use('/forgotPassword', require('./routes/ForgotPsswd'))
app.use('/diagnosis', require('./routes/Diagnosis'))
app.use('/prescription', require('./routes/Prescription'))
app.use('/consultation', require('./routes/Consultation'))
app.use('/bedAllotment', require('./routes/BedAllotment'))
app.use('/notification',require('./routes/Notification'))
app.use('/attendance',require('./routes/Attendance'))
// Mongoose connection

mongoose.connection.once('open', function () {
  console.log('connected to mongodb')
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
})
