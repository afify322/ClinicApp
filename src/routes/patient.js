const express=require("express")
const router=express.Router()
const multer=require("multer")
const exist=require("../middleware/auth").exist
const auth=require("../middleware/auth").auth
const patient=require("../controller/patient").ADdpatient
const Getpatients=require("../controller/patient").Getpatients
const Deletepatient=require("../controller/patient").Deletepatient
const FindPatient=require("../controller/patient").FindPatient
const UpdadtePatient=require("../controller/patient").UpdadtePatient
const Count=require("../controller/patient").Count
const AddMed=require("../controller/patient").AddMed
const AddTest=require("../controller/patient").AddTest
const GetMed=require("../controller/patient").GetMed
const GetTests=require("../controller/patient").GetTests
const CountMed=require("../controller/patient").CountMed
const CountTests=require("../controller/patient").CountTests




router.post("/AddPatient",exist,patient)
router.get("/GetPatients",Getpatients)
router.delete("/DeletePatient",Deletepatient)
router.get("/FindPatient",FindPatient)
router.patch("/UpdadtePatient",UpdadtePatient)
router.get("/Count",Count)
router.post("/AddMed",AddMed)
router.post("/AddTest",AddTest)
router.get("/GetMed",GetMed)
router.get("/GetTests",GetTests)
router.get("/CountMed",CountMed)
router.get("/CountTests",CountTests)


module.exports=router
