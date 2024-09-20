const moment = require('moment');

const { responseReturn } = require('../../utils/response');

const bcrypt = require('bcrypt');
const customerOrderModel = require('../../models/customerOrderModel');
const authOrderModel = require('../../models/authOrderModel');
const cartModel = require('../../models/cartModel');


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
                },{
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


}
module.exports = new orderController(); 