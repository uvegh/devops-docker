const express = require('express')
const app = express.Router()

const Employee = require('../Models/Employee')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const Patient = require('../Models/Patient')





let transporter = nodemailer.createTransport(sendgridTransport({


  auth: {
    api_key: process.env.SENGRID_API_KEY
  },


}));


let current_code = ""
let current_patient_code = ""



app.route('/').post(async (req, res) => {
  if (!req.body) return res.json({
    code: 401,
    msg: " request body is missing"
  })
  try {


    const found_email = await Employee.findOne({ "email": req.body.email })
    // console.log("found", found_email);
    if (!found_email) return res.json({
      msg: "email does not  exist",
      code: 404,


    })



    let data = {}

    let randomGenerator = function async() {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let z = Math.floor(Math.random() * 10);
      let a = Math.floor(Math.random() * 10);
      let b = Math.floor(Math.random() * 10);
      let c = Math.floor(Math.random() * 10);

      data.random_code = `${x}${y}${z}${a}${b}${c}`
      data._id = found_email._id
      data.email = found_email.email
    }

    randomGenerator()
    res.json({
      msg: "email sent",
      code: 200,
      data:found_email

    })
    // console.log("random code generated", data.random_code);
    current_code = data.random_code
    //console.log("current code", current_code);
    transporter.sendMail({
      to: req.body.email,
      from: "uveghobamien@gmail.com",
      subject: "Reset password code",
      html: "<p>One time code to reset password<p>" + data.random_code,

    }).then(console.log("success")).catch((err) => {
      console.log(err);
    })






  }
  catch (err) {
    res.status(500).send(err)
    console.log(err);
  }
})

app.route('/compare').post(async (req, res) => {
  if (!req.body) return res.json({
    msg: "request body is missing or incomplete",
    code: 401
  })

  try {
    console.log("check", current_code);
    if (current_code !== "") {
      if (current_code == req.body.code) return res.json({
        msg: "verification complete",
        code: 200
      })
      res.json({
        msg: "verification failed,resend code",
        code: 401
      })

    }
    else {
      res.json({
        msg: "verification failed",
        code: 401
      })
    }

  }
  catch (err) {
    res.status(500).send(err)
    //console.log(err);
    res.send({
      msg: "failed to verify "
    })
  }

})

app.route('/patient').post(async (req, res) => {
  if (!req.body) return res.json({
    code: 401,
    msg: " request body is missing"
  })
  try {


    const found_email = await Patient.findOne({ "email": req.body.email })
    //console.log("found", found_email);
    if (!found_email) return res.json({
      msg: "email does not  exist",
      code: 404


    })


    let data = {}

    let randomGenerator = function async() {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let z = Math.floor(Math.random() * 10);
      let a = Math.floor(Math.random() * 10);
      let b = Math.floor(Math.random() * 10);
      let c = Math.floor(Math.random() * 10);

      data.random_code = `${x}${y}${z}${a}${b}${c}`
      data._id = found_email._id
      data.email = found_email.email
    }

    randomGenerator()
    res.json({
      msg: "email sent",
      code: 200,
      data: found_email

    })
    //console.log("random code generated", data.random_code);
    current_patient_code = data.random_code
    //console.log("current code", current_patient_code);
    transporter.sendMail({
      to: req.body.email,
      from: "uveghobamien@gmail.com",
      subject: "Reset password code",
      html: "<p>One time code to reset password<p>" + data.random_code,
      //  text: data.random_code
    }).then(console.log("success")).catch((err) => {
      console.log(err);
    })






  }
  catch (err) {
     res.status(500).send(err)
    console.log(err);
  }
})

app.route('/compare/patient').post(async (req, res) => {
  if (!req.body) return res.json({
    msg: "request body is missing or incomplete",
    code: 401
  })

  try {
    //console.log("check", current_patient_code);
    if (current_patient_code !== "") {
      if (current_patient_code == req.body.code) return res.json({
        msg: "verification complete",
        code: 200
      })
      res.json({
        msg: "verification failed,resend code",
        code: 401
      })

    }
    else {
      res.json({
        msg: "verification failed",
        code: 401
      })
    }

  }
  catch (err) {
    res.status(500).send(err)
    console.log(err);
    res.send({
      msg: "failed to verify "
    })
  }

})



module.exports = app