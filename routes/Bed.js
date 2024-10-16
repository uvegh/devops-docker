const express=require('express')
const app=express.Router()
const Bed= require('../Models/Bed')
const Ward = require('../Models/Wards')

app.route('/').get(async(req,res)=>{
    try{
        let filter={}
        const {ward_id,patient,branch_id,bed_no,type,status}=req.query
        if(ward_id) filter.ward_id=ward_id
        if(patient)filter.patient=patient
        if(branch_id)filter.branch_id=branch_id
        if(bed_no)filter.bed_no=bed_no
        if(type)filter.type=type
        if(status)filter.status=status
    const get_all_beds= await Bed.find(filter).populate("ward_id").populate("branch_id").populate("patient").populate({
        path:"current_allotment",select:["reason_for_admission", "patient_id","date_assigned","discharge_date"
        ]
    }).sort()
    if(!get_all_beds)return res.json({
        msg:"Beds  not exist ",
        code:404,
    })

    res.json({
        msg:"successful",
        data:get_all_beds,
        code:200
       
    })
}
    catch(err){
        
        console.log(err); 

    res.status(500).send(err)
    res.json({msg:"failed to retrieve beds"})
    }
})

app.route('/create').post(async(req,res)=>{
    if(!req.body)return res.json({
        msg:"request body is missing or incomplete",
        code:"400"
    })

    try{
        const found_bed_no= await Bed.findOne({"bed_no":req.body.bed_no})

       
    //    console.log("found",found_bed_no)
if(found_bed_no)return res.json({
    msg:"bed already exist or in use, use a new bed number"
})

const bed=   new Bed(req.body)

await bed.save()

const update_ward_info= await Ward.findByIdAndUpdate(req.body.ward_id,{
    $push:{bed:bed._id}
})
//console.log("updated info",update_ward_info)
if(!bed) return res.json({
    msg:"failed to add bed",
    code:401
})

res.json({
    msg:"successful",
    data:bed,
    code:200
})
    }
    catch(err){
       
        res.status(500).send(err)
        console.log(err);
        res.json({
            msg:"failed to create bed"
        })
    }
})

app.route('/:id')
.get(async(req,res)=>{
    if(!req.params.id)return res.json({
        msg:"request body mimssing or incomplete",
        code:404
    })

    try{
        let bed= await Bed.findById(req.params.id).populate({
            path:"current_allotment",select:["reason_for_admission", "patient_id","date_assigned","discharge_date"
            ]
        })
        if(!bed) return res.json({
                code:404,
                msg:"bed does not exist"
            })
       

            res.json({
                msg:"successful",
                data:bed,
code:200
            })
        

    }
    catch(err){
        res.status(500).send(err);
        res.json({
            msg:"failed to retrieve bed"
        })
        console.log(err);
    }
})

.put(async(req,res)=>{
    if(!req.params.id)return res.json({
        msg:"request body missing or incomplete",
        code:400

    })
    try{
        const bed= await Bed.findById(req.params.id)
const updated_bed={...bed._doc,...req.body}
bed.overwrite(updated_bed)
 await bed.save()
res.json({
  msg:"success",
  data:bed,
    code:200
})

    }
    catch(err){
        res.status(500).send(err)
        res.json({
            msg:"failed to update bed"
        })
        console.log(err);
    }
})

.delete(async(req,res)=>{
    if(!req.params.id)return res.json({
        msg:"request body missing or incomplete",
        code:400
    })
    try{
     const bed=   await Bed.findById(req.params.id)
     if(!bed)return res.json({
        msg:"bed does not exist",
        code:404
     })
await Bed.findByIdAndDelete(req.params.id)

     res.json({
        msg:"bed deleted",
        code:200
     })
    }
    catch(err){
        res.status(500).send(err)
        console.log(err);
        res.json({
        msg:"failed to delete bed"    
        })
    }
})





module.exports=app