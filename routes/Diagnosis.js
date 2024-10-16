const express = require("express");
const app = express.Router();
const diagnosisModel = require("../Models/Diagnosis");

app.route("/").post(async (req, res) => {
  if (!req.body) return res.sendStatus(404);
  const diagnosis = new diagnosisModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    patient_dob: req.body.patient_dob,
    date_of_diagnosis: req.body.date_of_diagnosis,
    symptoms: req.body.symptoms,
    diagnosis: req.body.diagnosis,
    doctor_name: req.body.doctor_name,
    doctor_initials: req.body.doctor_initials,
  });
  const new_diagnosis = await diagnosis.save();
  res.json({
    code: 200,
    msg: "diagnosis saved successfully",
    data: new_diagnosis,
  });
});
app.route("/").get(async (req, res) => {
  const diagnosis = await diagnosisModel.find().populate('doctor_name')
  if (!diagnosis) return res.json({ code: 400, msg: "no diagnostic found" });
  res.json({
    code: 200,
    msg: "diagnosis found successfully",
    data: diagnosis,
  });
});

app
  .route("/:id")
  .put(async (req, res) => {
    if (!req?.params?.id) return res.json({ code: 404, msg: "bad request" });
    const diagnostic = await diagnosisModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!diagnostic)
      return res.json({ code: 404, msg: "diagnosis does not exist" });
    res.json({
      code: 200,
      msg: "diagnosis updated successful",
      data: diagnostic,
    });
  })

  .get(async(req,res)=>{
    if(!req?.params?.id) return res.json({code: 404, msg:"bad request"})
    const diagnosis = await diagnosisModel.findOne({_id:req.params.id}).exec()
    if(!diagnosis) return res.json({code: 404, msg:"diagnosis not found"})

    res.json({
      code:200,
      msg:"diagnosis found successfully",
      data:diagnosis
    })
  })

  .delete(async (req, res) => {
    if (!req?.params?.id) return res.json({ code: 404, msg: "bad request" });
    const diagnosis = await diagnosisModel.findOneAndDelete({
      _id: req.params.id,
    });
    res.json({
      code: 200,
      msg: "diagnosis deleted successfully",
      data: diagnosis,
    });
  });

module.exports = app;
