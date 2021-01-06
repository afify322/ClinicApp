const mongoose=require("mongoose")
const book=new mongoose.Schema({
    patient:{type:mongoose.Schema.Types.ObjectId,
    ref:'patient'
},
    cost:{
        type:Number
    },
    prev_visit:{
        type:String
    },
    next_visit:{
        type:String
    },
    notes:String
    

})