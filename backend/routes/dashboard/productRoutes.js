const productController= require('../../controllers/dashboard/productController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.post('/product-add',authMiddleware,productController.add_product);
router.get('/product-get',authMiddleware,productController.get_product);
router.get('/product-get/:productId',authMiddleware,productController.product_get);
router.post('/product-update',authMiddleware,productController.product_update);
router.post('/product-image-update',authMiddleware,productController.product_image_update);


module.exports = router;
