const mongoose=require("mongoose")
const book=new mongoose.Schema({
    patient:{type:mongoose.Schema.Types.ObjectId,
    ref:'patient'
},
    cost:{
        type:Number
    },
   
    notes:String,
    status:{
        type:String,
        default:"pending"},
        
        name:String
    

},{timestamps:true})
module.exports=mongoose.model('booking',book)