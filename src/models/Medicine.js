const mongoose=require("mongoose")
const medicine=new mongoose.Schema({
    name:String,
    Patients:[{
        Patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"patient"
   }
}]
})
exports.medicine=mongoose.model("medicine",medicine)