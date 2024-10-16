const express = require('express')
const app = express.Router()

const Attendance = require('../Models/Attendance')


app.route('/')
.post(async (req, res) => {
    if (!req.body) return res.json({
        msg: "something went wrong",
        code: 401
    })

    try {
const attendance=  new Attendance({
            
emp_id:req.body.emp_id,
sign_in:req.body.sign_in,
sign_out:req.body.sign_in,
notes:req.body.notes
          
        }
        )
        if (!attendance) return res.json({
            code: 404,
            msg: "something went wrong"
        })
        const new_attendance = await attendance.save()

        res.json({
            code: 200,
            msg: "successful",
            data: new_attendance
        })
    }
    catch (err) {
        res.status(500).send(err)
        console.log(500)
    }
})
    

.get(async(req,res)=>{
    const{
        emp_id,
        sign_in,
        sign_out,
        notes}=req.query
let filter={}
if(emp_id)filter.emp_id=emp_id
if(sign_in)filter.sign_in=sign_in
if(sign_out)filter.sign_out=sign_out
if(notes)filter.notes=notes


try{
    const attendance= await Attendance.find(filter)
    .populate({
        path:"emp_id",select:["first_name","last_name","avatar"]
    }).sort()
    if(!attendance) return res.json({
        msg:"something went wrong",
        code:400
    })

    res.json({
msg:"successful",
code:200,
data:attendance
    })
}
catch(err){
res.status(500).send(err)
console.log(err)
}
})

app.route("/:id")

.get(async(req,res)=>{
    try{
    
        if(!req.params.id) return res.json({
            code:401,
            msg:"bad request"
        })
    
        const single_attendance= await Attendance.findById(req.params.id) .populate({
            path:"emp_id",select:["first_name","last_name","avatar"]
        }).sort()
    
        if(!single_attendance)return res.json({
            code:404,
            msg:"something went wrong"
        })
    
     res.json({
        code:200,
        msg:"successful",
        data:single_attendance
     })
    }
    catch(err){
        res.status(500).send(err)
        console.log(err)
    }
    
    })

.delete(async(req,res)=>{
try{

    if(!req.params.id) return res.json({
        code:401,
        msg:"bad request"
    })

    const single_attendance= await Attendance.findById(req.params.id)

    if(!single_attendance)return res.json({
        code:404,
        msg:"something went wrong"
    })

 await Attendance.findByIdAndDelete(req.params.id)

 res.json({
    code:200,
    msg:"successful"
 })
}
catch(err){
    res.status(500).send(err)
    console.log(err)
}



})

.put(async(req,res)=>{
    if(!req.params.id)return res.json({
        code:401,
        msg:"bad request",

    })
try{
const attendance= await Attendance.findById(req.params.id)
if(!attendance) return res.json({
    code:404,
    msg:"something went wrong"
})

const update_attendance= {...attendance._doc,...req.body}
attendance.overwrite(update_attendance)
await attendance.save()
res.json({
    code:200,
    msg:"success",
    data:attendance

})

}
catch(err){
res.status(500).send(err)
console.log(err)
}

})
module.exports = app