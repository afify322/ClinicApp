const mongoose=require("mongoose")
const moment=require("moment")
 const schema=new mongoose.Schema({
Name:{
    type:String,
    required:true,
    trim:true
},
Tests:[{
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"test"
    },
    name:{
        type:String,
        trim:true
    },
    path:{
        type:String
    },
    date:{
        type:String,
     //   default:moment().format()
    }
    
}],
Age:{
    type:Number,
    required:true
},
Gender:{
    type:String,
    required:true,
    trim:true
},
Address:{
    type:String,
    required:true
},
Phone:{
    type:String,
    required:true
},
medicines:[{ 
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"medicine"
    },
    date:{
        type:Date
    },
    dose:{
        type:Date
    },
    name:{
        type:String
    }
}],
Notes:{
    type:String
},
Prev_visit:{
    type:Date,
    default:moment().format()

},
Next_visit:{
    type:Date
    
},

},
{timestamps:true})


 module.exports=mongoose.model('patient',schema)