const express=require('express')
const app=express.Router()
const Bed= require('../Models/Bed')
const Ward = require('../Models/Wards')
const Bed_Allotment=require('../Models/Bed_Allotment')

app.route('/').
get(async(req,res)=>{
    let filter={}
    const{reason_for_admission,patient_id,bed_id,discharge_date}=req.query
    if(reason_for_admission)filter.reason_for_admission=reason_for_admission
    if(patient_id)filter.patient_id=patient_id
    if(bed_id)filter.bed_id=bed_id
    if(discharge_date)filter.discharge_date=discharge_date
    
try{
    const bed_allotment= await Bed_Allotment
    .find(filter)
    .populate("patient_id")
    .populate("bed_id").sort()
    if(!bed_allotment) return res.json({
        code:404,
        msg:"something went wrong"
    })

res.json({
    code:200,
    data:bed_allotment,
    msg:"successful"
})
}
catch(err){
    res.status(500).send(err)
 
    console.log(err)
}
   

})

.post
( async(req,res)=>{
if(!req.body){
    return res.json({
        code:401,
        msg:"something went wrong"
    })
}

try{
    const bed_allotment= new Bed_Allotment({
        reason_for_admission:req.body. reason_for_admission,
patient_id:req.body.patient_id,
bed_id:req.body.bed_id,

discharge_date:req.body.discharge_date,
date_assigned:req.body.date_assigned
    });

if(!bed_allotment) return res.json({
    code:400,
    msg:"something went wrong"
})

const new_allotment= await bed_allotment.save()
res.json({
    code:200,
    msg:"successful",
    data:new_allotment
})
}
catch(err){
res.status(500).send(err)

}



})


app.route('/:id')
.get(async(req,res)=>{
    if(!req.params.id) return res.json({
        code:404,
        msg:"bad request"
    })
    try{
        const bed_allotment=await Bed_Allotment.findById(req.params.id)
        if(!bed_allotment)return res.json({
            code:404,
            msg:"something went wrong"
        })

        res.json({
            code:200,
            msg:"successful",
            data:bed_allotment
        })
    }
catch(err){
    res.status(500).send(err)
    console.log(err);
}
})

.delete(async(req,res)=>{
    if(!req.params.id) return res.json({
        code:401,
        msg:"bad request"
    })

    try{
        const bed_allotment= await Bed_Allotment.findById(req.params.id)
        if(!bed_allotment) res.json({
            msg:"something went wrong",
            code:404
        })
    const deleted_allotment= await Bed_Allotment.findByIdAndDelete(req.params.id)
    if(!deleted_allotment) return res.json({
        code:404,
        msg:"something went wrong"
    })
    
    res.json({
        code:200,
        msg:"successful",
        deleted_allotment
    })
    }
    catch(err){
res.status(500).send(err)
console.log(err);
    }
   

})

.put(async(req,res)=>{
    if(!req.params.id) return res.json({
        code:404,
        msg:"bad request"
    })

    try{
        const bed_allotment=await Bed_Allotment.findById(req.params.id)
        if(!bed_allotment)return res.json({
            code:404,
            msg:"something went wrong"
        })
        const updated_allotment={
            ...bed_allotment.doc,...req.body
        }
        bed_allotment.overwrite(updated_allotment)
        await  bed_allotment.save()
        res.json({
            code:200,
            msg:"successful",
            data:bed_allotment
        })
    }
    catch(err){
res.status(500).send(err)
console.log(err)
    }
    
})


module.exports=app