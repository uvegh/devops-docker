const express = require("express");
const Employee = require("../Models/Employee");
const bcrypt = require("bcrypt");
const pagination = require("../utils/pagination");
const app = express.Router();
const cloudinary = require("../utils/cloudinary");
const fileupload = require("express-fileupload");
app.use(
  fileupload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.route("/pfp/:id").put(async (req, res) => {
  if (!req.params.id)
    return res.json({
      code: 401,
      msg: "something went wrong",
    });
  try {
    // if (!req.body.avatar)
    //   return res.json({
    //     msg: "bad request",
    //     code: 401,
    //   })

    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.json({
        code: 404,
        msg: "something went wrong",
      });
    const avatar = req.files.avatar;
    const result = await cloudinary.uploader.upload(avatar.tempFilePath, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: "userAvatars",
    });
    console.log(result);
    employee.avatar = result.url;

    const updatePfp = { ...employee._doc, ...req.body };
    console.log(updatePfp);
    employee.overwrite(updatePfp);
    employee.save();
    res.json({
      code:200,
      msg:"successful",
      data:employee
    })
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

// get all employee route
// get all employee from the employee collection in the database and filter through via SIX(6) categories

app.route("/").get(async (req, res) => {
  let filter = {};
  const {
    role,
    hospital,
    branch,
    department,
    status,
    staff_type,
    email,
    first_name,
    last_name,
    _id,
    gender,
  } = req.query;
  if (role) filter.role = role;
  if (hospital) filter.hospital = hospital;
  if (branch) filter.branch = branch;
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (staff_type) filter.staff_type = staff_type;
  if (email) filter.email = email;
  if (first_name) filter.first_name = first_name;
  if (last_name) filter.last_name = last_name;
  if (gender) filter.gender = gender;
  if (_id) filter._id = _id;

  try {
    const employees = await pagination(Employee, req, filter);

    res.status(200).json({ msg: "Request successful", employees });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// Single employee route
app.route("/:id/pwd").put(async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ msg: "Bad request sent" });
  }
  const password = req.body.password;
  const employee = await Employee.findOne({ _id: req?.params?.id }).exec();
  if (!employee) return res.status(400).json({ msg: "Employee not found" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    // console.log(hashed_password)
    const update_employee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { password: hashed_password } },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Updated successfully", data: update_employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

app
  .route("/:id")
  // update employee info in the employee collection in the database

  .put(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: "Bad request sent" });
    }
    if (req.body.password) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Handle error incase wrong id is passed
    const employee = await Employee.findOne({ _id: req?.params?.id }).exec();
    if (!employee) return res.status(400).json({ msg: "Employee not found" });

    try {
      // const salt = await bcrypt.genSalt(10)
      // const hashed_password = await bcrypt.hash(password, salt)
      // console.log(hashed_password, newdata, 'test')
      const update_employee = await Employee.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      res
        .status(200)
        .json({ msg: "Updated successfully", data: update_employee });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  })

  // get single employee info from the employee collection in the database

  .get(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: "Failed request" });
    }
    try {
      const employee = await Employee.findOne({ _id: req.params.id });
      if (!employee) {
        return res.status(400).json({ msg: "Employee not found" });
      }
      res.status(200).json({ msg: "Employee info found", data: employee });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  })

  //   delete a single employee detail from the employee collection in the database

  .delete(async (req, res) => {
    if (!req?.params?.id) {
      return res.status(400).json({ msg: "Failed request" });
    }
    try {
      const employee = await Employee.findOne({ _id: req.params.id }).exec();
      if (!employee) {
        return res.status(400).json({ msg: "Employee not found" });
      }
      const result = await employee.deleteOne();
      res
        .status(200)
        .json({ msg: "Employee deleted successfully", data: result });
    } catch (err) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  });
module.exports = app;
