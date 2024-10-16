const express = require("express");
const pagination = require("../utils/pagination");
const Nurse = require("../Models/Nurse");
const Employee = require("../Models/Employee");
const app = express.Router();

app.route("/").get(async (req, res) => {
  let filter = {};
  const { emp_id, ward_no, patients_incharge_of } = req.query;
  if (emp_id) filter.emp_id = emp_id;
  if (ward_no) filter.ward_no = ward_no;
  if (patients_incharge_of) filter.patients_incharge_of = patients_incharge_of;
  try {
    const found_nurse = await pagination(Nurse, req, filter);

    res.status(200).json({ msg: "Record found", found_nurse });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

app
  .route("/:id")
  .post(async (req, res) => {
    const { ward_no, branch_id, patients_incharge_of } = req.body;
    let speciality = "";
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee || employee.role !== "nurse") {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const get_nurse_info = await Nurse.findOne({
      emp_id: req?.params?.id,
    }).exec();
    try {
      // create a new nurse info if the particular nutse has none yet
      if (!get_nurse_info) {
        speciality = new Nurse({
          emp_id: req.params.id,
          ward_no: ward_no,
          patients_incharge_of: patients_incharge_of,
          branch_id: branch_id,
        });
       
        await speciality.save();
        res.status(201).json({
          msg: "Ward and patients assigned ",
          data: speciality,
        });
      }
      // if only ward is being assigned
      if (get_nurse_info && ward_no) {
        const update_ward = get_nurse_info.ward_no.filter(
          (obj) => obj._id == ward_no
        ).length;
        if (!update_ward) {
          get_nurse_info.ward_no.push(ward_no);
          speciality = await get_nurse_info.save();
          res.status(201).json({ msg: "Ward Assiged", data: speciality });
        } else {
          res.status(200).json({ msg: "Already exist" });
        }
      }
      // if only patient is being assigned
      if (get_nurse_info && patients_incharge_of) {
        const update_patient = get_nurse_info.patients_incharge_of.filter(
          (obj) => obj._id == patients_incharge_of
        ).length;
        if (!update_patient) {
          get_nurse_info.patients_incharge_of.push(patients_incharge_of);
          speciality = await get_nurse_info.save();
          res.status(201).json({ msg: "Patient Assiged", data: speciality });
        } else {
          res.status(200).json({ msg: "Already exist" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  })

  .get(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: "Failed request" });
    }
    try {
      const nurse_info = await Nurse.findOne({ emp_id: req.params.id });
      if (!nurse_info) return res.status(400).json({ msg: "No info found" });
      res.status(200).json({ msg: "Nurse's info found", data: nurse_info });
    } catch (err) {
      res.status(500).json({ err: "Failed to fetch" });
    }
  })
  .put(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: "Failed request" });
    }
    try {
      const update_specialty = await Nurse.findOneAndUpdate(
        { emp_id: req.params.id },
        req.body,

        { new: true }
      );
      res
        .status(200)
        .json({ msg: "Successfully updated", data: update_specialty });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  });

app.route("/:id/rmv").post(async (req, res) => {
  const { ward_no, patients_incharge_of } = req.body;
  const update = await Nurse.findOne({
    emp_id: req?.params?.id,
  }).exec();
  if (!update) {
    res.status(400).json({ msg: "Record not found" });
  }

  try {
    if (ward_no) {
      const found_ward_no = update.ward_no.findIndex(
        (obj) => obj._id == ward_no
      );

      if (found_ward_no !== -1) {
        update.ward_no.splice(found_ward_no, 1);
        await update.save();
        res.status(200).json({ msg: "Deleted successfully", update });
      }
    } else if (patients_incharge_of) {
      const found_patient = update.patients_incharge_of.findIndex(
        (obj) => obj._id == patients_incharge_of
      );
      if (found_patient !== -1) {
        update.patients_incharge_of.splice(found_patient, 1);
        await update.save();
        res.status(200).json({ msg: "Deleted successfully", update });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = app;
