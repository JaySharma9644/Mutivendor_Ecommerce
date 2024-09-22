const moment = require('moment');

const { responseReturn } = require('../../utils/response');

const customerOrderModel = require('../../models/customerOrderModel');
const authOrderModel = require('../../models/authOrderModel');
const cartModel = require('../../models/cartModel');
const { mongo: { ObjectId } } = require("mongoose");


class orderController {

    paymentCheck = async (id) => {
        try {
            const order = await customerOrderModel.findById(id)
            if (order.payment_status === 'unpaid') {
                await customerOrder.findByIdAndUpdate(id, {
                    delivery_status: 'cancelled'
                })
                await authOrderModel.updateMany({
                    orderId: id
                }, {
                    delivery_status: 'cancelled'
                })
            }
            return true
        } catch (error) {
            console.log(error)
        }
    }


    place_order = async (req, res) => {

        const { price, products, shipping_fee, items, shippingInfo, userId } = req.body;

        let cartId = [];
        const tempDate = moment(Date.now()).format('LLL');
        let customerOrderProduct = [];


        // create order information for customers 
        for (let i = 0; i < products.length; i++) {
            const cartProducts = products[i].products;
            for (let j = 0; j < cartProducts.length; j++) {
                const customerOrderInfo = cartProducts[j].productInfo;
                customerOrderInfo.quantity = cartProducts[j].quantity;
                customerOrderProduct.push(customerOrderInfo);
                if (cartProducts[j]._id) {
                    cartId.push(cartProducts[j]._id)
                }
            }

        }
        try {

            const order = await customerOrderModel.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                payment_status: 'unpaid',
                delivery_status: 'pending',
                date: tempDate
            })


            // create order information for sellers 
            let authorOrderData = [];
            for (let i = 0; i < products.length; i++) {
                const cartProducts = products[i].products;
                const pri = products[i].price;
                const sellerId = products[i].sellerId;
                let sellerProducts = [];
                for (let j = 0; j < cartProducts.length; j++) {
                    const sellerOrderInfo = cartProducts[j].productInfo;
                    sellerOrderInfo.quantity = cartProducts[j].quantity;
                    sellerProducts.push(sellerOrderInfo);

                }
                authorOrderData.push({
                    orderId: order.id,
                    sellerId,
                    products: sellerProducts,
                    price: pri,
                    payment_status: 'unpaid',
                    shippingInfo: 'Easy Main Warehouse',
                    delivery_status: 'pending',
                    date: tempDate
                })

            }

            await authOrderModel.insertMany(authorOrderData);

            // delete all placed order form cart 
            for (let k = 0; k < cartId.length; k++) {
                await cartModel.findByIdAndDelete(cartId[k])
            }
            setTimeout(() => {
                this.paymentCheck(order.id)
            }, 15000)
            responseReturn(res, 200, { message: "Order Placed Success", orderId: order.id })



        } catch (err) {
            console.log(err.message)
        }


    }
    get_customer_dashboard_data = async (req, res) => {
        const { userId } = req.params;
        try {
            const recentOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId)
            }).limit(5);

            const pendingOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId), delivery_status: 'pending'
            }).countDocuments();

            const totalOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId)
            }).countDocuments();

            const cancelledOrders = await customerOrderModel.find({
                customerId: new ObjectId(userId), delivery_status: 'cancelled'
            }).countDocuments();


            responseReturn(res, 200, {
                recentOrders,
                pendingOrders,
                totalOrders,
                cancelledOrders

            })

        } catch (err) {
            console.log(err.message)
        }


    }

    get_orders = async (req, res) => {

        const { customerId, status } = req.params;
        try {
            let orders = [];
            if (status !== 'all') {
                orders = await customerOrderModel.find({
                    customerId: new ObjectId(customerId),
                    delivery_status: status
                })
            } else {
                orders = await customerOrderModel.find({
                    customerId: new ObjectId(customerId)
                })
            }

            responseReturn(res, 200, {
                orders
            })

        } catch (error) {
            console.log(error.message)
        }


    }

    get_order_details = async (req, res) =>{
        const { orderId} = req.params; 
        let order ;
        try{
            order = await customerOrderModel.findById(orderId);
            
            responseReturn(res, 200, {
                order
            })
            
        }catch(error){
            console.log(error.message)
        }
    }


}
module.exports = new orderController(); 