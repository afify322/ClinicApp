const mongoose=require("mongoose")
const moment=require("moment")
 const schema=new mongoose.Schema({
Name:{
    type:String,
    required:[true],
    trim:true,
    unique:true
    
},
Tests:[{
    test:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"test"
    },
    name:{
        type:String,
        trim:true,
        required:true
    },
    images:{
        type:Array
    },
    date:{
        type:String,
        required:true
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
    medicine:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"medicine"
    },
    date:{
        type:Date,
        required:true
    },
    dose:{
        type:Date,
        required:true
    },
    name:{
        type:String,
        required:true
    }
}],
smoker:{type:Boolean,
required:true},
diabetic:{type:Boolean,
    required:true},
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