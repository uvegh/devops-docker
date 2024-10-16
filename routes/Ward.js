const express = require('express')
const app = express.Router()
const Ward = require('../Models/Wards')

app.route('/').get(async (req, res) => {
  let filter={}
  const{branch_id,name,type,total_bed}=req.query
  if(branch_id)filter.branch_id=branch_id
  if(name)filter.name=name
  if(type)filter.type=type
  if(total_bed)filter.total_bed=total_bed
  try {
    const get_all_wards = await Ward.find(filter).populate("branch_id").populate({
      path: "bed"  ,populate:{
        path:"patient"
      }
     
        }).sort()
    if (!get_all_wards)
      return res.json({
        code: 404,
        msg: 'wards do not exist'
      })
    res.json({
      msg: 'success',
      data: get_all_wards,
      code: 200
    })
  } catch (err) {
    res.status(500).send(err)
    console.log(err)
    res.json({
      msg: 'failed to retrieve ward'
    })
  }
})

app.route('/create').post(async (req, res) => {
  if (!req.body)
    return res.json({
      code: 400,
      msg: 'request body is missing or incomplete'
    })
  try {
    const duplicate = await Ward.findOne({ name: req.body.name })
    if (duplicate)
      return res.json({
        msg: 'ward alaready exist,create ward using a new name',
        code: 400
      })

    const ward = new Ward(req.body)
    await ward.save()
    res.json({
      msg: 'successful',
      data: ward,
      code: 200
    })
  } catch (err) {
    res.status(500).send(err)
    console.log(err)
    res.json({
      msg: 'failed to create new ward'
    })
  }
})

app
  .route('/:id')
  .get(async (req, res) => {
    if (!req.params.id)
      return res.json({
        code: 400,
        msg: 'request body is missing or incomplete'
      })

    try {
      let ward = await Ward.findById(req.params.id).populate("branch_id").populate({
    path: "bed"  ,populate:{
      path:"patient"
    }
   
      }).sort()
      if (!ward)
        return res.json({
          msg: 'ward does not exist',
          code: 404
        })

      res.json({
        msg: 'successful',
        data: ward,
        code: 200
      })
    } catch (err) {
      res.status(500).send(err)
      console.log(err)
      res.json({
        msg: 'failed to retrieve ward'
      })
    }
  })

  .put(async (req, res) => {
    if (!req.params.id)
      return res.json({
        code: 400,
        msg: 'request body is missing or incomplete'
      })
    try {
      const ward = await Ward.findById(req.params.id)
      if (!ward) return res.send('ward does not exist')
      let update_ward = { ...ward._doc, ...req.body }
      ward.overwrite(update_ward)

      await ward.save()
      res.json({
        msg: 'successful',
        data: ward,
        code: '200'
      })
    } catch (err) {
      res.status(500).send(err)
      console.log(err)
      res.json({
        msg: 'failed to update ward '
      })
    }
  })

  .delete(async (req, res) => {
    if (!req.params.id)
      return res.json({
        msg: 'request body is missing or incomplete'
      })

    try {
      let ward = await Ward.findById(req.params.id)
      if (!ward)
        return res.json({
          msg: 'ward does not exist',
          code: 404
        })

      await Ward.findByIdAndDelete(req.params.id)
      res.json({
        msg: 'ward deleted',
        code: 200
      })
    } catch (err) {
      res.status(500).send(err)
      res.json({
        msg: 'failed to delete ward '
      })

      console.log(err)
    }
  })

module.exports = app
