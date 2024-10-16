const mongoose=require('mongoose')
const Schema=mongoose.Schema



const NotificationSchema=Schema({
    sender:{
        type:String,ref:"employees"
    },
    info:{
        type:String
    },
    reciever:{
        type:String,ref:"employees",required:true
    },
    seen:{
        type:Boolean,default:false,required:true
    },
    type:{
        type:String,
        enum:["emergency","urgent","normal"]
    }

},{timestamps:true})

const Notification=mongoose.model("notifications",NotificationSchema)
module.exports=Notification