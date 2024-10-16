const express = require("express");
const app = express.Router();
const pharmacistModel = require("../Models/Pharmacist");

app.route("/").post(async (req, res) => {
  const pharmacist = new pharmacistModel({
    emp_id: req.body.emp_id,
    pharmacy_id: req.body.pharmacy_id,
  });
  const new_phamacist = await pharmacist.save();
  res.json({
    code: 200,
    msg: "pharmacist created successfully",
    data: new_phamacist,
  });
});

app.route("/").get(async (req, res) => {
  const filter = {};
  const { emp_id } = req.query;
  if (emp_id) filter.emp_id = emp_id;
  const pharmacist = await pharmacistModel.find(filter)
  .populate('emp_id')
  .populate('pharmacy_id')
  if (!pharmacist) {
    return res.status(404).json({ msg: "no found" });
  }
  res.json({
    code: 200,
    msg: "pharmacist found successfully",
    data:pharmacist,
  });
});

app.route('/:id')
.put(async(req,res)=>{
 try {
  const pharmacist = await pharmacistModel.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
  if(!pharmacist){
    return res.status(404).json({ msg: "no found"})
  }
  res.json({
    code: 200,
    msg:"pharmacist updated successfully",
    data:pharmacist
  })
 } catch (error) {
  return res.json(error)
 }
})

.get(async (req, res) => {
  const pharmacist = await pharmacistModel.findOne({_id:req.params.id})
  .populate('emp_id')
  .populate('pharmacy_id')

  if(!pharmacist){
    return res.status(404).json({ msg: "no found"});
  }
  res.json({
    code: 200,
    msg:"pharmacist found successfully",
    data:pharmacist
  })
})

.delete(async(req,res)=>{
  try {
    const pharmacist = await pharmacistModel.findOneAndDelete({_id:req.params.id})
    if(!pharmacist){
      return res.status(404).json({ msg: "no found"}); 
    }
    res.json({
      code: 200,
      msg:"pharmacist deleted successfully",
      date:pharmacist
    })
    
  } catch (error) {
    return res.json(error)
    console.log(error)
  }
})
module.exports = app;
