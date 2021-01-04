const express=require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require('cors')
require("./db/mongoose")
const admin=require("./routes/admin")
const patient=require("./routes/patient")

const port=process.env.PORT ||3000
//const multer=require("multer")
//const upload=multer()
const auth=require("./middleware/auth").auth
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))


/* const storage = multer.diskStorage({
   destination: function (req, file, cb)  {
      cb(null, 'images');

    }, 
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '-' + file.originalname )
      }
  });  
app.use(multer({storage:storage}).single("image"))*/


app.use("/patient",patient)
app.use("/Admin",admin)
app.listen(port)