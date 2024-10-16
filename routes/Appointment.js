const express = require('express')
const app = express.Router()
const appointmentModel = require('../Models/Appointment')

app.route('/').post(async (req, res) => {

  

  if (!req?.body) return res.sendStatus(400).json({ msg: 'bad request' })
  const appointment = new appointmentModel({
    card_no: req.body.card_no,
    physician: req.body.physician,
    notes: req.body.notes,
    status: req.body.status,
    date:req.body.date,
    time:req.body.time,
    doctor_seen:req.body.doctor_seen,
 nurse_seen:req.body.nurse_seen,
  payment_status:req.body.payment_status
  })
  const new_appointment = await appointment.save()
  res.json({
    code: 200,
    msg: 'appointment created successfully',
    new_appointment
  })
})

app.route('/').get(async (req, res) => {
  let filter={}
  const {card_no,physician,payment_status,nurse_seen,doctor_seen}=req.query
  if(card_no)filter.card_no=card_no
  if(physician)filter.physician=physician
  if(payment_status)filter.payment_status=payment_status
  if(nurse_seen)filter.nurse_seen=nurse_seen
  if(doctor_seen)filter.doctor_seen=doctor_seen
  try {
    const appointment = await appointmentModel.find(filter)
    if (!appointment) return res.json({ msg: 'no appointment booked' })
    res.json({
      code: 200,
      msg: 'all appointments booked',
      appointment
    })
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

app
  .route('/:id')
  .put(async (req, res) => {
    if (!req?.params?.id)
      return res.sendStatus(400).json({ msg: 'bad request' })
    try {
      const appointment = await appointmentModel.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      )
      res.json({
        code: 200,
        msg: 'appointment updated successfully',
        appointment
      })
    } catch (error) {
      console.log(error)
      return res.sendStatus(500).json(error)
    }
  })

  .get(async (req, res) => {
    if (!req?.params?.id)
      return res.sendStatus(400).json({ msg: 'bad request' })
    try {
      const appointment = await appointmentModel
        .findOne({ _id: req.params.id })
        .exec()
      if (!appointment) return res.sendStatus(404).json({ msg: 'not found' })
      res.json({
        code: 200,
        msg: 'single appointment found',
        appointment
      })
    } catch (error) {
      console.log(error)
      return res.sendStatus(500).json(error)
    }
  })

  .delete(async (req, res) => {
    if (!req?.params?.id)
      return res.sendStatus(404).json({ msg: 'bad request' })
    const appointment = await appointmentModel
      .findOne({ _id: req.params.id })
      .exec()
    if (!appointment) return res.sendStatus(404).json({ msg: 'not found' })
    const result = await appointment.deleteOne()
    res.json({
      code: 200,
      msg: 'appointment deleted successfully',
      result
    })
  })
module.exports = app
