const orderController = require('../../controllers/order/orderController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = require('express').Router();
router.post('/home/order/place-order',orderController.place_order);
router.get('/home/customer/get-customer-dashboard-data/:userId',orderController.get_customer_dashboard_data);
router.get('/home/customers/get-orders/:customerId/:status',orderController.get_orders);
router.get('/home/customers/get-order-details/:orderId',orderController.get_order_details);
router.get('/admin/order',orderController.get_admin_orders);
router.get('/admin/get-order-details/:orderId',orderController.get_admin_order_details);
router.post('/admin/order_status_update/:orderId',orderController.admin_order_status_update);
router.get('/seller/order/:sellerId',orderController.get_seller_orders);
router.get('/seller/get-order-details/:orderId',orderController.get_seller_orders_details);
router.post('/seller/order_status_update/:orderId',orderController.seller_order_status_update);
router.post('/order/create-payment',orderController.create_payment)
router.get('/order/confirm/:orderId',orderController.order_confirm)

module.exports = router;
