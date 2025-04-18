import {Router} from 'express'
import { createProduct } from '../controller/product.controller'
import { protect } from '../middlewares/auth.middleware'


const router=Router()

router.route("/").post(protect,createProduct)

export default router