import {Router} from 'express'
import { createProduct, deleteProduct, deleteProductsByAmdin, getAllProducts, getAllProductsByAmdin, getAllProductsofUser, getAllSoldProducts, getProductBySlug, updateProduct, verifyAndAddCommissionProductByAmdin } from '../controller/product.controller.js'
import { isAdmin, isSeller, protect } from '../middlewares/auth.middleware.js'
import { upload } from '../utils/upload.js'



const router=Router()

router.route("/").post(protect,isSeller, upload.single("image"),createProduct)
router.route("/").get(getAllProducts)
router.route("/:id").delete( protect,isSeller, deleteProduct);
router.route("/:id").patch( protect, isSeller, upload.single("image"), updateProduct);
router.route("/user").get( protect, getAllProductsofUser);
router.route("/sold").get( getAllSoldProducts);
router.route("/:id").get( getProductBySlug);

router.route("/admin/product-verified/:id").patch( protect, isAdmin, verifyAndAddCommissionProductByAmdin);
router.route("/admin/products").get( protect, isAdmin, getAllProductsByAmdin);
router.route("/admin/products").delete( protect, isAdmin, deleteProductsByAmdin);

export default router