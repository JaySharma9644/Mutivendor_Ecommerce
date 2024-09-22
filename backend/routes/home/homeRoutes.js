const homeController= require('../../controllers/home/homeController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.get('/get-categories',homeController.get_category);
router.get('/get-products',homeController.get_products);
router.get('/get-price-range-product',homeController.get_products);
router.get('/query-products',homeController.query_products);
router.get('/product-details/:slug',homeController.product_details);
router.get('/product-details/:slug',homeController.product_details);
router.post('/customer/submit-review',homeController.submit_review);
router.get('/customer/get-reviews/:productId',homeController.get_product_reviews);
module.exports = router;
