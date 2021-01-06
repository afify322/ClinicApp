const mongoose=require("mongoose")
const attend=mongoose.Schema({
     name:String,
    clerk:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"clerk"
         },
     attend_date:{type:String,default:"Not attended"},
     leave_date:{type:String,default:"Attended but not left"},
     hours_of_work:Number
  
})
module.exports=mongoose.model('attend',attend)