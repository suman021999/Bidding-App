import {Router} from 'express'
import { createProduct } from '../controller/product.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { upload } from '../utils/upload.js'



const router=Router()

router.route("/").post(protect, upload.single("image"),createProduct)

export default router