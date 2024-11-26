const sellerController= require('../../controllers/dashboard/sellerController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.get('/request-seller-get',authMiddleware,sellerController.seller_get);
router.get('/seller-get/:sellerId',authMiddleware,sellerController.get_seller);
router.post('/seller-status-update/',authMiddleware,sellerController.seller_status_update);
router.get('/get-active-sellers',authMiddleware,sellerController.get_active_sellers);
router.get('/get-deactive-sellers',authMiddleware,sellerController.get_deactive_sellers);


module.exports = router;
