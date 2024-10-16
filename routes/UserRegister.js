const express = require('express')
const Patient = require('../Models/Patient')
const bcrypt = require('bcrypt')
const app = express.Router()

app.route('/user').post(async (req, res) => {
  const { password, email } = req.body

  if (!req.body) return res.status(400).json({ msg: 'All info are required' })
  // check for duplicates in database
  const check_duplicates = await Patient.findOne({ email }).exec()
  if (check_duplicates) return res.status(409).json({ msg: 'Already exists' })

  try {
    // encrypt password
    const hashed_password = await bcrypt.hash(password, 10)

    // Created & store new admin
    const new_patient = await Patient.create({
      first_name: req?.body?.first_name,
      last_name: req?.body?.last_name,
      avatar: req?.body?.avatar,
      gender: req?.body?.gender.toLowerCase(),
      password: hashed_password,
      email: email,
      d_o_b: req?.body?.d_o_b,
      phone: req?.body?.phone,
      address: req?.body?.address.toLowerCase(),
      occupation: req?.body?.occupation.toLowerCase(),
      type_of_patient: req.body.type_of_patient,
      allergies: req?.body?.allergies,
      insurance: req?.body?.insurance,
      emergency_contact: req?.body?.emergency_contact,
      vitals: req?.body?.vitals
    })
    res.status(201).json({ msg: 'New patient info created', data: new_patient })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong' })
  }
})

module.exports = app
