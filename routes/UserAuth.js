const express = require('express')
const Patient = require('../Models/Patient')
const bcrypt = require('bcrypt')
const app = express.Router()

// User route
app.route('/user').post(async (req, res) => {
  let found_user = ''
  const { emailOrPhone, password } = req.body
  if (!emailOrPhone || !password) {
    return res.status(400).json({ msg: 'All fields required' })
  }
  // check if email exists
  try {
    if (emailOrPhone.includes('@')) {
      found_user = await Patient.findOne({ email: emailOrPhone }).exec()
    } else {
      found_user = await Patient.findOne({ phone: emailOrPhone }).exec()
    }
    if (!found_user) return res.status(401).json({ msg: 'Invalid credentials' })

    // decode password
    const match = await bcrypt.compare(password, found_user.password)
    if (match) {
      const data = {
        id: found_user._id,
        email: found_user.email,
        phone: found_user.phone,
        first_name: found_user.first_name,
        last_name: found_user.last_name,
        avatar: found_user.avatar,
        gender: found_user.gender
      }
      res.status(200).json({ msg: 'Login successful', data: data })
    } else {
      res.status(401).json({ msg: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
})

module.exports = app
