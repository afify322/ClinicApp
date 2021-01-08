const mongoose=require("mongoose")
const validator=require("validator")
const moment=require("moment")
const bcrypt=require("bcrypt")
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    Email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid Email")
                        }
        }
    },
    password:{
        type:String,
        required:true,
    
    },
     token:{
            type:String,
        }
},{
    timestamps:true
})



module.exports=mongoose.model("admins",schema)