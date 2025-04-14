import {Router} from 'express'
import { getUser, loginASseller, loginStatus, loginUser, logout, registerUser } from '../controller/User.controller.js'
import { protcet } from '../middlewares/auth.middleware.js'

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logdin").get(loginStatus)
router.route("/logout").get(logout)
router.route("/seller").post(loginASseller)
router.route("/getuser").get(protcet,getUser)


export default router