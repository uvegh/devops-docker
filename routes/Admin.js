const express = require('express')
const Admin = require('../Models/Admin')
const app = express.Router()

// get all admin route
// get all admin from the admin collection in the database

app.route('/').get(async (req, res) => {
  try {
    const get_all_admins = await Admin.find()
    if (!get_all_admins) {
      return res.status(204).json({ msg: 'No Admin info exists' })
    }
    res.status(200).json({ msg: 'Success', data: get_all_admins })
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
})

// create single admin route
// create a new admin to the admin collection in the database

app.route('/create').post(async (req, res) => {
  if (!req?.body) {
    return res.status(400).json({ msg: 'Cannot create Admin' })
  }
  try {
    const admin = new Admin({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address
    })

    const new_admin = await admin.save()
    res.status(201).json({ msg: 'Info created successfully', data: new_admin })
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
})

// Single admin route

app
  .route('/:id')
  // get single admin info from the admin collection in the database
  .get(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Failed request' })
    }
    try {
      const admin = await Admin.findOne({ _id: req.params.id }).exec()
      if (!admin) {
        return res.status(400).json({ msg: 'Admin not found' })
      }
      res.status(200).json({ msg: 'admin info found', data: admin })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })
  // update admin info in the admin collection in the database

  .put(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Failed request' })
    }

    // Handle error incase wrong id is passed
    const admin = await Admin.findOne({ _id: req?.params?.id }).exec()
    if (!admin) return res.status(400).json({ msg: 'Admin not found' })

    try {
      const update_admin = await Admin.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      )
      res.status(200).json({ msg: 'Updated successfully', data: update_admin })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })

  //   delete a single admin detail from the admin collection in the database

  .delete(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Failed request' })
    }
    try {
      const admin = await Admin.findOne({ _id: req.params.id }).exec()
      if (!admin) {
        return res.status(400).json({ msg: 'Admin not found' })
      }
      const result = await admin.deleteOne()
      res.status(200).json({ msg: 'Admin deleted successfully', data: result })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })

module.exports = app
