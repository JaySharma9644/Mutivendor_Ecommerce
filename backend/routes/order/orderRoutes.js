const orderController = require('../../controllers/order/orderController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.post('/home/order/place-order',orderController.place_order);




module.exports = router;
