const express = require('express')
const app = express.Router()
const Notification = require('../Models/Notification')


app.route('/')
.post(async (req, res) => {
    if (!req.body) return res.json({
        msg: "something went wrong",
        code: 401
    })

    try {

        const notification = await new Notification({
            
            sender: req.body.sender,
            info: req.body.info,
            reciever: req.body.reciever,
            seen: req.body.seen,
            type:req.body.type
        }
        )
        if (!notification) return res.json({
            code: 404,
            msg: "something went wrong"
        })
        const new_notification = await notification.save()

        res.json({
            code: 200,
            msg: "successful",
            data: new_notification
        })
    }
    catch (err) {
        res.status(500).send(err)
        console.log(500)
    }
})
    

.get(async(req,res)=>{
    const{sender,reciever,info,seen}=req.query
let filter={}
if(sender)filter.sender=sender
if(reciever)filter.reciever=reciever
if(info)filter.info=info
if(seen)filter.seen=seen


try{
    const notification= await Notification.find(filter)
    .populate({
        path:"sender",select:["first_name","last_name","avatar"]
    })
    .populate({
        path:"reciever",select:["first_name","last_name","avatar"]
    }).sort()
    if(!notification) return res.json({
        msg:"something went wrong",
        code:400
    })

    res.json({
msg:"successful",
code:200,
data:notification
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
    
        const single_notification= await Notification.findById(req.params.id).populate({
            path:"sender",select:["first_name","last_name","avatar"]
        })
        .populate({
            path:"reciever",select:["first_name","last_name","avatar"]
        }).sort()
    
        if(!single_notification)return res.json({
            code:404,
            msg:"something went wrong"
        })
    
     res.json({
        code:200,
        msg:"successful",
        data:single_notification
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

    const single_notification= await Notification.findById(req.params.id)

    if(!single_notification)return res.json({
        code:404,
        msg:"something went wrong"
    })

 await Notification.findByIdAndDelete(req.params.id)

 res.json({
    code:200,
    msg:"notification deleted"
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
const notification= await Notification.findById(req.params.id)
if(!notification) return res.json({
    code:404,
    msg:"something went wrong"
})

const update_notification= {...notification._doc,...req.body}
notification.overwrite(update_notification)
await notification.save()
res.json({
    code:200,
    msg:"success",
    data:notification

})

}
catch(err){
res.status(500).send(err)
console.log(err)
}

})
module.exports = app