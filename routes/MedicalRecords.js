const express = require('express')
const Medical_records = require('../Models/Medical_Record')
const app = express.Router()

app.route('/').get(async (req, res) => {
  try {
    const record = await Medical_records.find()
    res.status(200).json({ msg: 'Records found', data: record })
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
})

app.route('/create').post(async (req, res) => {
  if (!req?.body) {
    return res.status(400).json({ msg: 'Failed request' })
  }
  try {
    const medical_record = new Medical_records({
      card_no: req.body.card_no,
      diagnosis: req.body.diagnosis.toLowerCase(),
      symptoms: req.body.symptoms.toLowerCase(),
      treatments: req.body.treatments.toLowerCase(),
      follow_up_info: req.body.follow_up_info.toLowerCase(),
      medications: req.body.medications.toLowerCase(),
      lab: req.body.lab,
      doctor: req.body.doctor
    })
    const new_medical_record = await medical_record.save()
    res
      .status(201)
      .json({ msg: 'Record created successfully', data: new_medical_record })
  } catch (err) {
    return res.status(500).json({ msg: 'Something went wrong' })
  }
})

app
  .route('/:id')
  .get(async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ msg: 'Invalid request sent' })
    }
    const record = await Medical_records.findOne({ _id: req.params.id }).exec()
    if (!record) {
      return res.status(400).json({ msg: 'No record found' })
    }
    res.status(200).json({ msg: 'Record found', data: record })
  })

  .put(async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ msg: 'Invalid request sent' })
    }
    const old_record = await Medical_records.findOne({
      _id: req?.params?.id
    }).exec()
    if (!old_record) {
      return res.status(400).json({ msg: 'No record found' })
    }
    try {
      const record = await Medical_records.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      )
      res.status(200).json({ msg: 'Record successfully updated', data: record })
    } catch (err) {
      res.status(500).json({ err: 'Something went wrong' })
    }
  })

  .delete(async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ msg: 'Invalid request' })
    }
    try {
      const record = await Medical_records.findOne({
        _id: req?.params?.id
      }).exec()
      if (!record) {
        return res.status(400).json({ msg: 'No record found' })
      }
      const result = await record.deleteOne()
      res.status(200).json({ msg: 'Successfully deleted', data: result })
    } catch (err) {
      return readSync.status(500).json({ msg: 'Something went wrong' })
    }
  })

module.exports = app
