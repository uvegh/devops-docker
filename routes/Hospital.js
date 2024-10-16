const express = require('express')
const app = express.Router()
const hospitalModel = require('../Models/Hospital')

app.route('/').post(async (req, res) => {
  if(!req.body) return res.json({msg:"bad request"})
  const hospital = new hospitalModel({
    name: req.body.name,
    phone: req.body.phone,
    email:req.body.email,
    cac_no:req.body.cac_no,
    organization: req.body.organization,
    pharmacy:req.body.pharmacy,
    prefix:req.body.prefix
  })
  const duplicate = await hospitalModel.findOne({email:req.body.email}).exec()
  if(duplicate) return res.json({code:404, msg:"hospital already exists"})
  const new_hospital = await hospital.save()
  res.json({
    code:200,
    msg:"hospital created successfully",
    new_hospital
  })
})

app.route('/').get(async (req, res) => {
  try {
    // enable filter
    const filter = {}
    const {prefix} = req.query
    if(prefix) filter.prefix = prefix
    const hospital = await hospitalModel.find(filter)
    if (!hospital)
      return res.sendStatus(404).json({ msg: 'hospital not found' })
    res.json({
      code: 200,
      msg: 'all hospital',
      data:hospital
    })
  } catch (err) {
    res.status(500).send(err)
  }
})

app
  .route('/:id')
  .put(async (req, res) => {
    if (!req.params?.id) {
      return res.sendStatus(400).json({ message: 'bad request' })
    }
    try {
      const hospital = await hospitalModel
        .findById({ _id: req.params.id })
        .exec()
      if (!hospital)
        return sendStatus(404).json({ msg: 'hospital does not exist' })

      let data = { ...hospital._doc, ...req.body }
      hospital.overwrite(data)
      await hospital.save()
      res.json({
        code: 200,
        msg: 'hospital updated successfully',
        data:hospital
      })
    } catch (error) {
      return res.json(error)
    }
  })
  .delete(async (req, res) => {
    if (!req?.params?.id)
      return res.sendStatus(400).json({ msg: 'bad request' })
    try {
      const hospital = await hospitalModel
        .findOne({ _id: req.params.id })
        .exec()
      if (!hospital)
        return res.sendStatus(404).json({ msg: 'hospital not found' })
      const result = await hospitalModel.findByIdAndDelete({
        _id: req.params.id
      })
      return res.json({
        code: 200,
        msg: 'hospital deleted successfully',
        result
      })
    } catch (error) {
      return res.json(error)
    }
  })

  .get(async (req, res) => {
    if (!req?.params?.id)
      return res.sendStatus(400).json({ msg: 'bad request' })
    try {
      const hospital = await hospitalModel
        .findOne({ _id: req.params.id })
        .exec()
      if (!hospital)
        return res.sendStatus(400).json({ msg: 'hosptial not found' })
      return res.json({
        code: 200,
        msg: 'single hospital found',
        data:hospital
      })
    } catch (error) {
      return res.json(error)
    }
  })

module.exports = app
