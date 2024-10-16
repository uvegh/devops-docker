const express = require('express')
const app = express.Router()
const medicationModel = require('../Models/Medications')

app.route('/').post(async (req, res) => {
  if (!req?.body) return res.json('bad request')
  try {
    const medication = new medicationModel({
      is_collected: req.body.is_collected,
      card_no: req.body.card_no,
      medications: req.body.medications,
      dosage: req.body.dosage,
      freq: req.body.freq
    })
    const new_medication = await medication.save()
    res.json({
      code: 200,
      msg: 'medication saved successfully',
      new_medication
    })
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

app.route('/').get(async (req, res) => {
  const medication = await medicationModel.find()
  if (!medication) return res.status(404)
  res.json({
    code: 200,
    msg: 'all medications found',
    medication
  })
})

app
  .route('/:id')
  .put(async (req, res) => {
    if (!req.params.id) return res.status(404)
    try {
      const medication = await medicationModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      )
      res.json({
        code: 200,
        msg: 'medication updated successfully',
        medication
      })
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  })

  .get(async (req, res) => {
    if (!req?.params?.id) return res.json({ code: 404, msg: 'bad request' })
    try {
      const medication = await medicationModel
        .findOne({ _id: req.params.id })
        .exec()
      if (!medication) return res.json({ msg: 'no medication found' })
      res.json({
        code: 200,
        msg: 'medication found',
        medication
      })
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  })

  .delete(async (req, res) => {
    if (!req.params?.id) return res.json({ msg: 'bad request' })
    try {
      const medication = await medicationModel
        .findOne({ _id: req.params.id })
        .exec()
      if (!medication) return res.json({ msg: 'not found' })
      const result = await medication.deleteOne()
      res.json({
        code: 200,
        msg: 'medication deleted successfully',
        result
      })
    } catch (error) {
      console.log(error)
      return res.json(error)
    }
  })
module.exports = app
