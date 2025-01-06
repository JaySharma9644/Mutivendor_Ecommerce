const paymentController= require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get('/payment/create-stripe-connect-account',authMiddleware,paymentController.create_stripe_connect_account)
router.put('/payment/active-stripe-connect-account/:activeCode',authMiddleware,paymentController.active_stripe_connect_account)
router.get('/payment/get_seller_payment_details/:sellerId',authMiddleware,paymentController.get_seller_payment_details)
router.post('/payment/withdrawal-request',authMiddleware,paymentController.seller_withdraw_request)
router.get('/payment/get_payment_request',authMiddleware,paymentController.get_payment_request)
router.post('/payment/payment_request_confirm',authMiddleware,paymentController.payment_request_confirm)

module.exports = router;