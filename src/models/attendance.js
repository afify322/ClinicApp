const mongoose=require("mongoose")
const attend=mongoose.Schema({
     name:String,
    clerk:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"clerk"
         },
     attend_date:{type:Date},
     leave_date:{type:Date},
     seconds_of_work:Number
  
})
module.exports=mongoose.model('attend',attend)