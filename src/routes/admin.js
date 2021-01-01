
const express=require("express")
const router=express.Router()
const signup=require("../controller/admin").signup
const getadmins=require("../controller/admin").getadmins
const getadmin=require("../controller/admin").getadmin
const login=require("../controller/admin").login
const logout=require("../controller/admin").logout


const auth=require("../middleware/auth").auth


router.post("/signup",signup)
router.get("/getadmin",getadmin)
router.get("/getadmins",getadmins)
router.post("/login",login)
router.post("/logout",logout)

module.exports=router