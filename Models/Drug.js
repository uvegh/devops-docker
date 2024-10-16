const mongoose=require('mongoose')
const Schema=mongoose.Schema

const DrugSchema=mongoose.Schema({
    
    name:{type:String,required:true} ,
    category:{type:String,required:true},      
    status  :{type:String,required:true, enum:['available','not-available']},                
    brand   :{type:String,required:true},
    strength:{type:String, required:true},
    expire_date:{type:Date,required:true},   
    batch_no:{type:String,required:true},
    item_code:{type:String,required:true},                
   quantity :{type:Number,required:true},              
   price :{type:Number,required:true},                        
   pharmacy_id :{type:String,ref:"pharmacies"},   
   branch_id:{type:String, ref:"branches"}            
})

const Drug=mongoose.model('drugs',DrugSchema)
module.exports=Drug