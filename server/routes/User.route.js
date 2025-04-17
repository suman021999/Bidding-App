import {Router} from 'express'
import { estimateIncome, getAlluser, getUser, getuserBalence, isAdmin, loginASseller, loginStatus, loginUser, logout, registerUser } from '../controller/User.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logdin").get(loginStatus)
router.route("/logout").get(logout)
router.route("/seller").post(loginASseller)
router.route("/getuser").get(protect,getUser)
router.route("/sellamount").get(protect,getuserBalence)
router.route("/allusers").get(protect,isAdmin,getAlluser)
router.route("/estimate-income").get(protect,isAdmin,estimateIncome)


export default router