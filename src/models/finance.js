const mongoose =require("mongoose")
const salaryS=new mongoose.Schema({
    date:Date,
    clerkid:mongoose.Schema.Types.ObjectId,
    salary:{
        required:true,
        type:Number
    }
})
const salary=mongoose.model("salary",salaryS)
const transactionsS=new mongoose.Schema({
    type:String,
    cost:Number,
    date:Date,
    note:String
})
const transactions=mongoose.model("transactions",transactionsS)
module.exports = {
    salary: salary,
   transactions: transactions
  }