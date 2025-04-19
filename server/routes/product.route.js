import {Router} from 'express'
import { createProduct } from '../controller/product.controller.js'
import { protect } from '../middlewares/auth.middleware.js'


const router=Router()

router.route("/").post(protect,createProduct)

export default router