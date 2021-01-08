const admin=require("../models/admin")
const patient=require("../models/patient")
const jwt=require("jsonwebtoken")
exports.auth=async (req,res,next)=>{
   try {
        const header=req.header("Authorization").replace("Bearer ","")


const decode=jwt.verify(header,"hello")
console.log(header)
const user=await admin.findById(decode._id)


if(!user){
    throw new Error()
}
req.token=header
req.user=user
next()
   } catch (error) {
      res.status(401).send({Error_Flag:1,message:"please authintecate"})  
   }



}
/* exports.exist=async(req,res,next)=>{
   patient.findOne({Name:req.body.name.trim()}).then((data)=>{
      if(data){
        return res.status(400).send({Error_Flag:1,message:"Patient Alreeady exist"})

      }
      next()
   })
   .catch((error)=>{
      res.status(400).send({Error_Flag:1,message:error.message})
   })
} */