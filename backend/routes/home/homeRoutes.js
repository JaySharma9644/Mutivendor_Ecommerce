const homeController= require('../../controllers/home/homeController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.get('/get-categories',homeController.get_category);
router.get('/get-products',homeController.get_products);
router.get('/get-price-range-product',homeController.get_products);
router.get('/query-products',homeController.query_products);




module.exports = router;
