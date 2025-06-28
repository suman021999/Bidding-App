import {Router} from 'express'
import { isSeller, protect } from '../middlewares/auth.middleware.js'
import { getBiddingHistory, placeBid, sellProduct } from '../controller/bidding.controller.js';
const router=Router()

router.route("/:productId").get(getBiddingHistory);
router.route("/sell").post( protect, isSeller, sellProduct);
router.route("/").post( protect, placeBid);




export default router


// {
// 	"productId":"68570848cd8fa66ac4197407", 
//  "price":459
// }