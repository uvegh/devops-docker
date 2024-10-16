const mongoose=require('mongoose')
const Schema=mongoose.Schema

const PharmacistSchema=mongoose.Schema({
  
	emp_id:{
        type:Schema.Types.ObjectId,ref:"employees",required:true
    },
    pharmacy_id:{type:String, ref:'pharmacies', required:true}
})

const Pharmacist=mongoose.model('pharmacist',PharmacistSchema)
module.exports=Pharmacist