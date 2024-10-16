const express = require('express')
const Employee = require('../Models/Employee')
const bcrypt = require('bcrypt')
const app = express.Router()

// Employee route
app.route('/employee').post(async (req, res) => {
  let found_user = ''
  const { emailOrPhone, password } = req.body
  if (!emailOrPhone || !password) {
    return res.status(400).json({ msg: 'All Fields required' })
  }

  // check if it exists
  try {
    if (emailOrPhone.includes('@')) {
      found_user = await Employee.findOne({ email: emailOrPhone }).exec()
    } else {
      found_user = await Employee.findOne({ phone: emailOrPhone }).exec()
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
        role: found_user.role,
         address: found_user.address,
         department:found_user.department,
         hospital:found_user.hospital,
         status:found_user.status="available",
         avatar:found_user.avatar,
         gender:found_user.gender
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
