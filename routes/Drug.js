const express = require('express');
const app = express.Router()
const drugModel = require('../Models/Drug')
const pharmacyModel = require('../Models/Pharmacy')


app.route('/').post(async(req,res)=>{
  if(!req?.body) return res.sendStatus(400).json({msg:"bad request"})
  const drug = new drugModel({
    name: req.body.name,
    category: req.body.category,
    status:req.body.status,
    brand: req.body.brand,
    strength: req.body.strength,
    quantity: req.body.quantity,
    expire_date: req.body.expire_date,
    batch_no: req.body.batch_no,
    item_code: req.body.item_code,
    price: req.body.price,
    pharmacy_id: req.body.pharmacy_id,
    branch_id: req.body.branch_id
  })
  const new_drug = await drug.save()
  await pharmacyModel.findByIdAndUpdate(req.body.pharmacy_id, {
    $push:{drug_id: new_drug._id}
  })
  res.json({
    code:201,
    msg:"drug created successfully",
    drug
  })
})

app.route('/').get(async(req,res)=>{
  try {

    let filter = {}
    const {name, category, brand} = req.query
    if(name) filter.name = name
    if(category) filter.category = category
    if(brand) filter.brand = brand

    // enable pagination
    const pageSize = Number(req.query.limit) || 15;
    const pageNumber = Number(req.query.page) || 1;
    const count = await drugModel.find(filter).estimatedDocumentCount();

    const drugs =  await drugModel.find(filter)
    .populate('branch_id')
    .populate('pharmacy_id')
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize)

    if(!drugs) return res.sendStatus(400).json({msg:"no drugs found"})
    res.json({
      code:200,
      msg:"drugs found successfully",
      data:drugs,
      pageNumber,
      pages: Math.ceil(count / pageSize),
      count
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500).json(error)
  }
})

app.route('/:id')

.put(async(req, res)=>{
if(!req?.params?.id) return res.sendStatus(400).json({msg:"bad request"})
const drug = await drugModel.findOneAndUpdate({_id:req.params.id}, req.body, {new:true})
res.json({
  code:200,
  msg:"drug updated successfully",
  data:drug
})
})

.get(async(req,res)=>{
  if(!req?.params?.id) return res.sendStatus(400).json({msg:"bad request"})
  const drug = await drugModel.findOne({_id:req.params.id}).populate({path:'branch_id', select:['name','address','phone'], populate:{path:"hospital", select:['name', 'email']}}).exec()
  if(!drug) return res.sendStatus(400).json({msg:"drug not found"})
  res.json({
    code:200,
    msg:"drug found successfully",
    data:drug
  })
})

.delete(async(req,res)=>{
  if(!req?.params?.id) return res.sendStatus(400).json({msg:"bad request"})
  const drug = await drugModel.findOne({_id:req.params.id}).exec()
  if(!drug) return res.sendStatus(404).json({msg:"drug not found"})
  const result = await drug.deleteOne()
  res.json({
    code:200,
    msg:"drug deleted successfully",
    result
  })
})
module.exports = app