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

/* schema.methods.generatetoken=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},"hello")
    const is =jwt.verify(token,'hello')
     user.tokens=user.tokens.concat({token})
     console.log(user.tokens)
     await use.save()
    return token
} */

module.exports=mongoose.model("admins",schema)