import {Router} from 'express'
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controller/product.controller.js'
import { isSeller, protect } from '../middlewares/auth.middleware.js'
import { upload } from '../utils/upload.js'



const router=Router()

router.route("/").post(protect,isSeller, upload.single("image"),createProduct)
router.route("/").get(getAllProducts)
router.route("/:id").delete( protect,isSeller, deleteProduct);
router.route("/:id").put( protect, isSeller, upload.single("image"), updateProduct);
export default router