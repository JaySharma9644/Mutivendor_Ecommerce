const cartController = require('../../controllers/home/cartController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.post('/home/product/add-to-cart',cartController.add_to_cart);
router.get('/home/product/get-cart-products/:userId',cartController.get_card_products);
router.get('/home/product/delete_cart_products/:cartId',cartController.delete_cart_products);
router.put('/home/product/cart_quantity_increment/:cartId',cartController.cart_quantity_increment);
router.put('/home/product/cart_quantity_decrement/:cartId',cartController.cart_quantity_decrement);




module.exports = router;
