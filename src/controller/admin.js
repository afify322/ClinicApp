
const express=require("express")
const mongoose=require("mongoose")
const validator=require("validator")
const admin=require("../models/admin")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
exports.signup=async(req,res,next)=>{
    let admindata
try {
    let hashedpass=await bcrypt.hash(req.body.password,8)

    admindata  =await new admin({name:req.body.name,Email:req.body.Email,password:hashedpass})
    return await admindata.save()
    
    .then((data)=>{
     
        
        const token=jwt.sign({_id:data._id.toString()},"hello")
        return admin.findByIdAndUpdate(data._id,{token:token})
    
    }).then((data)=>{
        return admin.findById(data._id)
    }
    ).then((user)=>{
        res.status(201).send({Error_flag:0,message:"Created successful",user:{_id:user._id,name:user.name,Email:user.email,createdAt:user.createdAt,updatedAt:user.updatedAt},token:user.token})

    })
        
    .catch((error)=>{
        if(error.message){
            res.status(400).send({Error_flag:1,message:error.message})
        }
        else{
            res.status(400).send({Error_flag:1,message:"Email Already Exist"})
 
        }
      })       
      
} catch (error) {
   res.status(401).send(error)
 
}
    
}
exports.getadmins=(req,res,next)=>{
    
   let page=req.query.page
    admin.find().skip((page-1)*10).limit(10).then((data)=>{
        res.status(200).send({Error_flag:0,Admins:data})
    }).catch(err=>res.status(400).send({Error_flag:1,message:err.message,last_page:Math.ceil(data.length/10)})
    )
}
exports.getadmin=(req,res,next)=>{
    const _id=req.query.id
    admin.findById(_id).then((data)=>{
        if(!data){
          return  res.status(200).send({Error_flag:1,message:"User not found"})
        }
      return  res.status(200).send({Error_flag:0,Admin:data})
    }).catch(err=>res.status(400).send({Error_flag:1,message:err.message}))
}
exports.login=async(req,res,next)=>{
    if(req.token){
       return res.status(400).send({Error_flag:0,message:"You Are ALreaedy Logged In !"})

    }
   try {
      let email=req.body.Email

        const user=await admin.findOne({Email:email})
       const ismatched=await bcrypt.compare(req.body.password,user.password)
        const token=jwt.sign({_id:user._id.toString()},"hello")
      
        await user.save();
        if(ismatched){
            res.status(200).send({Error_flag:0, message:"login sucssful",user:{_id:user._id,name:user.name,Email:user.email,createdAt:user.createdAt,updatedAt:user.updatedAt},token:token})

        }
       else res.status(400).send({Error_flag:0,message:"Wrong email or password"})

   } catch (error) {
        res.status(400).send({Error_flag:0,message:error.message})
   }
}
exports.logout=async(req,res,next)=>{
    if(re)
    try {
        req.user.token=null
        await req.user.save()
        res.send({Error_flag:1,message:"logout successful"})
    } catch (error) {
        res.status(500).send({Error_flag:1,message:error.message})
    }
}