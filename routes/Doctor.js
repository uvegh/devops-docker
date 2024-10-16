const express = require('express')
const Doctor = require('../Models/Doctors')
const pagination = require('../utils/pagination')
const app = express.Router()

app.route('/').get(async (req, res) => {
  let filter = {}
  const { emp_id, branch_id, speciality,status } = req.query
  if (branch_id) filter.branch_id = branch_id
  if (emp_id) filter.emp_id = emp_id
  if (speciality) filter.speciality = speciality
  if (status) filter.status = status
  try {
    const found_doctors = await pagination(Doctor, req, filter)

    res.status(200).json({ msg: 'Record found', found_doctors })
  } catch (err) {
    res.status(500).json({
      msg: 'Something went wrong'
    })
  }
})

app
  .route('/:id')
  .post(async (req, res) => {
    if (!req?.body) {
      return res.status(400).json({ msg: 'Branch not found' })
    }
    try {
      const speciality = new Doctor({
        emp_id: req.params.id,
        speciality: req.body.speciality,
        branch_id: req.body.branch_id
      })
      const new_speciality = await speciality.save()
      res.status(201).json({
        msg: 'Specialty assigned ',
        data: new_speciality
      })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })
  .get(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Failed request' })
    }
    try {
      const doctor_info = await Doctor.findOne({
        emp_id: req.params.id
      })
      if (!doctor_info) return res.status(400).json({ msg: 'No info found' })
      res.status(200).json({ msg: "Doctor's info found", data: doctor_info })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })
  .put(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Failed request' })
    }
    try {
      const update_specialty = await Doctor.findOneAndUpdate(
        { emp_id: req.params.id },
        req.body,
        { new: true }
      )
      res
        .status(200)
        .json({ msg: 'Successfully updated', data: update_specialty })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })

module.exports = app
