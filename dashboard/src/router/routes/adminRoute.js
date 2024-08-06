
import { lazy } from 'react';
const AdminDashboard = lazy(()=>import('../../views/admin/AdminDashboard'));
const Orders = lazy(()=>import('../../views/admin/Order'));
const Category = lazy(()=>import('../../views/admin/Category'));
const Sellers = lazy(()=>import('../../views/admin/Seller'));
const PaymentRequest = lazy(()=>import('../../views/admin/PaymentRequest'));
const DeactiveSellers = lazy(()=>import('../../views/admin/DeActiveSellers'));
const SellerRequest = lazy(()=>import('../../views/admin/SellerRequest'));
const SellerDetails = lazy(()=>import('../../views/admin/SellerDetails'));
const ChatSeller = lazy(()=>import('../../views/admin/SellerChat'));
const OrderDetails = lazy(()=>import('../../views/admin/OrderDetails'));

export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element : <AdminDashboard/>,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/orders',
        element : <Orders/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/category',
        element : <Category/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers',
        element : <Sellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/payment-request',
        element : <PaymentRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/deactive-sellers',
        element : <DeactiveSellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers-request',
        element : <SellerRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/seller/details/:sellerId',
        element : <SellerDetails/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/chat-sellers',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/order/details/:orderId',
        element : <OrderDetails/> ,
        role : 'admin'
    }
]
export default adminRoutes;