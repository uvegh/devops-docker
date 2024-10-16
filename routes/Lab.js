const express = require('express')
const Lab = require('../Models/Lab')
const app = express.Router()

// Get all labs
app.route('/').get(async (req, res) => {
  try {
    const lab = await Lab.find()
    if (!lab) {
      return res.status(400).json({ msg: 'No info found' })
    }
    res.status(200).json({ msg: 'Request successful', data: lab })
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
})
// create a new lab
app.route('/create').post(async (req, res) => {
  if (!req?.body) {
    res.status(400).json({ msg: 'Failed request' })
  }
  try {
    const lab = new Lab({
      name: req?.body?.name,
      branch: req?.body?.branch,
      head_of_dept: req?.body?.head_of_dept
    })
    const new_lab = await lab.save()
    res.status(201).json({ msg: 'New lab created', data: new_lab })
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong' })
  }
})

app
  .route('/:id')
  // get a single lab info
  .get(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Invalid request' })
    }
    try {
      const lab = await Lab.findOne({ _id: req.params.id })
      if (!lab) {
        res.status(400).json({ msg: 'No info found' })
      }
      res.status(200).json({ msg: 'Request successful', data: lab })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })
  // edit a single lab info

  .put(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Invalid request' })
    }
    try {
      const update_lab = await Lab.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true
        }
      )
      res.status(200).json({ msg: 'Updated successfully', data: update_lab })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })
  // delete a lab info

  .delete(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: 'Invalid request' })
    }
    try {
      const lab = await Lab.findOne({ _id: req.params.id }).exec()

      if (!lab) {
        res.status(400).json({ msg: 'No info found' })
      }
      const result = await lab.deleteOne()
      res.status(200).json({ msg: 'Request successful', data: result })
    } catch (err) {
      res.status(500).json({ msg: 'Something went wrong' })
    }
  })

module.exports = app
