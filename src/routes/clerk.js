const express=require('express')
const router=express.Router()
const AddClerk=require("../controller/clerk").AddClerk
const UpdateClerk=require("../controller/clerk").UpdateClerk
const FindClerk=require("../controller/clerk").FindClerk
const DeleteClerk=require("../controller/clerk").DeleteClerk
const Attended=require("../controller/clerk").Attended
const getAttendance=require("../controller/clerk").getAttendance
const Count=require("../controller/clerk").Count
const salary=require("../controller/clerk").salary
const Expenses=require("../controller/clerk").Expenses
const transactions=require("../controller/clerk").transactions


router.post("/AddClerk",AddClerk)
router.patch("/UpdateClerk",UpdateClerk)
router.get("/FindClerk",FindClerk)
router.delete("/DeleteClerk",DeleteClerk)
router.patch("/Attended",Attended)
router.get("/GetAttendance",getAttendance)
router.get("/Count",Count)
router.post("/salary",salary)
router.post("/Expenses",Expenses)
router.get("/GetTransactions",transactions)


module.exports=router
