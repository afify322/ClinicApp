const express=require("express")
const router=express.Router()
const { body } = require('express-validator');
const exist=require("../middleware/auth").exist
const auth=require("../middleware/auth").auth
const patient=require("../controller/patient").ADdpatient
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
const UpdateMed=require("../controller/patient").UpdateMed
const UpdateTest=require("../controller/patient").UpdateTest
const reservation=require("../controller/patient").reservation
const Confirmreservation=require("../controller/patient").Confirmreservation
const Getreservations=require("../controller/patient").Getreservations
const Deletereservation=require("../controller/patient").Deletereservation
const Cancelreservation=require("../controller/patient").Cancelreservation
const FindpatientByid=require("../controller/patient").FindpatientByid
const Deletemed=require("../controller/patient").Deletemed


router.delete("/Deletemed",Deletemed)
router.post("/AddPatient",patient)
router.get("/FindpatientByid",FindpatientByid)
router.delete("/DeletePatient",Deletepatient)
router.get("/FindPatient",FindPatient)
router.patch("/UpdadtePatient",UpdadtePatient)
router.get("/Count",Count)
router.post("/AddMed",AddMed)
router.post("/AddTest",/* [
    body('name')
      .trim()
      ,
    body('content')
      .trim()
      .isLength({ min: 5 })
  ]
, */AddTest)
router.get("/GetMed",GetMed)
router.get("/GetTests",GetTests)
router.get("/CountMed",CountMed)
router.get("/CountTests",CountTests)
router.patch("/UpdateMed",UpdateMed)
router.patch("/UpdateTest",UpdateTest)
router.post("/Reservation",reservation)
router.patch("/ConfirmReservation",Confirmreservation)
router.get("/GetReservations",Getreservations)
router.patch("/Cancelreservation",Cancelreservation)
router.delete("/Deletereservation",Deletereservation)


module.exports=router
