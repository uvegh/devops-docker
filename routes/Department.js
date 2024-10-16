const express = require('express');
const app = express.Router()
const departmentModel = require('../Models/Departments')

app.route('/').post(async(req, res)=>{
  if(!req?.body) return res.sendStatus(404).json({msg:"bad request"})
  try {
    const duplicate = await departmentModel.findOne({name:req.body.name})
  if(duplicate) return res.sendStatus(404).json({msg:"duplicate department"})

  const new_department = new departmentModel({
    name:req.body.name,
    head_of_dept:req.body.head_of_dept,
    branch_id:req.body.branch_id
  })

  const result = await new_department.save()
  res.json({
    code:200,
    msg:"department created successfully",
    result
  })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500).json(error)
  }
})

app.route('/').get(async(req,res)=>{
try {
  const department = await departmentModel.find().populate({path:"branch_id", populate:{path:"hospital"}}).exec()
if(!department) return res.sendStatus(404).json({msg:"no department found"})
  res.json({
    code:200,
    msg:"department found",
    department
  })
} catch (error) {
  console.log(error)
}
})

app.route('/:id')
.put(async(req, res)=>{
  if(!req.params?.id) return res.sendStatus(400).json({msg:"bad request"})
  const department = await departmentModel.findOneAndUpdate({_id:req.params.id}, req.body, {new:true})
  res.json({
    code:200,
    msg:"department updated successfully",
    department
  })
})

.delete(async(req, res) => {
  if(!req?.params?.id) return res.sendStatus(400).json({msg:"bad request"})
  const department = await departmentModel.findOne({_id:req.params.id}).exec()
  if(!department) return res.sendStatus(400).json({msg:"department not found"})
  const result = await department.deleteOne()
  res.json({
    code:200,
    msg:"department deleted successfully",
    result
  })
})

.get(async(req, res)=>{
  if(!req?.params?.id) return res.sendStatus(400).json({msg:"bad request"})
  const department = await departmentModel.findOne({_id:req.params.id}).populate('branch_id').exec()
  if(!department) return res.sendStatus(404).json({msg:"no department found with id " + req.params.id})
  res.json({
    code:200,
    msg:"department found successfully",
    department
  })
})

module.exports = app