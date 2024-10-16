const express = require('express');
const app = express.Router();
const prescriptionModel = require('../Models/Prescription')

app.route('/').post(async(req, res)=>{
  if(!req?.body) return res.json({code:404, msg:"Fields required"})

  const prescription = new prescriptionModel({
    patient_id: req.body.patient_id,
    card_no:req.body.card_no,
    date_of_diagnosis: req.body.date_of_diagnosis,
    prescription: req.body.prescription,
    notes: req.body.notes,
    doctor_id: req.body.doctor_id,
  })

  if(!prescription) return res.json({msg:"Fields not completed"})

  const new_prescription = await prescription.save()
  res.json({
    code:201,
    msg:"prescription created successfully",
    data: new_prescription
  })
})

app.route('/').get(async(req,res)=>{
  try {
    const filter = {}
    const {date_of_diagnosis, drug_id, doctor_name, card_no} = req.query
    if(date_of_diagnosis) filter.date_of_diagnosis = date_of_diagnosis
    if(drug_id) filter.drug_id = drug_id
    if(doctor_name) filter.doctor_name = doctor_name
    if(card_no) filter.card_no = card_no
    const prescription = await prescriptionModel.find(filter)
    // .populate({path:"drug_id", select:['name', 'category','price','status']})
    .populate('patient_id')
    .populate('doctor_id')
    if(!prescription) return res.json({code:404, msg:"no prescription found"})
    res.json({
      code:200,
      msg:"prescription found successfully",
      data:prescription
    })
  } catch (error) {
    console.log(error)
    return res.json(error.message)
  }
})

app.route('/:id')
.put(async(req,res)=>{
  if(!req?.params?.id) return res.json({code:404, msg:"bad request"})
 try {
  const prescription = await prescriptionModel.findOneAndUpdate({_id:req.params.id}, req.body, {new:true})

  if(!prescription) return res.json({code:404, msg:"no prescription found"})

  res.json({
    code:200,
    msg:"prescription updated successfully",
    data:prescription
  })
 } catch (error) {
  console.log(error)
  return res.json(error.message)
 }
})
.get(async(req,res)=>{
  try {
    if(!req?.params?.id) return res.json({code:404, msg:"bad request"})
    const prescription = await prescriptionModel.findOne({_id:req.params.id})
    .populate('patient_id')
    .populate('doctor_id')

    if(!prescription) return res.json({code:404, msg:"prescription not found"})
    res.json({
      code:200,
      msg:"prescription found successfully",
      data:prescription
    })
  } catch (error) {
    console.log(error)
    return res.json(error.message)
  }
})

.delete(async(req,res)=>{
  if(!req?.params?.id) return res.json({code:404, msg:"bad request"})
  const prescription = await prescriptionModel.findOneAndDelete({_id:req.params.id}).exec()
  if(!prescription) return res.json({code:404, msg:"not found"})
  res.json({
    code:200,
    msg:"prescription deleted successfully",
    data:prescription
  })
})

module.exports = app