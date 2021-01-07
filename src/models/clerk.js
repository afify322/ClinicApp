const mongoose=require('mongoose')
const moment=require("moment")
const clerk=mongoose.Schema({
    name: { type : String , unique : true, required : true, dropDups: true },
    phone:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
    address:{
        type:String
    },
    salary:{
        type:Number
    },
    notes:{
        type:String
    },
    hire_date:{
        type:String,
        default:moment().format()
    }
    ,
    current_status:{
        type:String,
        
    },
    seconds_of_work:{
        type:Number,
        default:0
    },
    
},{ timestamps:true})
module.exports=mongoose.model('clerk',clerk)