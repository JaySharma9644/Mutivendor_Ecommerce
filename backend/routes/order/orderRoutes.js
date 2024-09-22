const orderController = require('../../controllers/order/orderController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.post('/home/order/place-order',orderController.place_order);
router.get('/home/customer/get-customer-dashboard-data/:userId',orderController.get_customer_dashboard_data);
router.get('/home/customers/get-orders/:customerId/:status',orderController.get_orders);
router.get('/home/customers/get-order-details/:orderId',orderController.get_order_details);



module.exports = router;
