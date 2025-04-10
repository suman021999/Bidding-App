import {Router} from 'express'
import { loginASseller, loginStatus, loginUser, logout, registerUser } from '../controller/User.controller.js'

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logdin").get(loginStatus)
router.route("/logout").get(logout)
router.route("/seller").post(loginASseller)


export default router