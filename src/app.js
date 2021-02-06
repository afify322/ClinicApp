const express=require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require('cors')
//require("./middleware/eslint")
const admin=require("./routes/admin")
const patient=require("./routes/patient")
const clerk=require("./routes/clerk")
const compression=require("compression")
const parser=require("./middleware/fileupload").parser
const mongoose=require("mongoose")




const port=process.env.PORT ||3000

const auth=require('./middleware/auth').auth

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(compression())


app.use(parser)
app.use("/clerk",clerk)
app.use("/patient",patient)
app.use("/Admin",admin)


mongoose.connect("mongodb+srv://first:6PhsjC3EuCp4z9oy@cluster0.kb4eg.mongodb.net/clinic?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true},).then((data)=>{
      app.listen(port)
    }).catch((err)=>{
      console.log(err)
    })
