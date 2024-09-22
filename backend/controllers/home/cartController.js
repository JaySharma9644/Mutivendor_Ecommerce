const cartModel = require("../../models/cartModel");
const wishlistModel = require("../../models/wishlistModel");
const { responseReturn } = require("../../utils/response");
const { mongo: { ObjectId } } = require("mongoose");

class cartController {

    add_to_cart = async (req, res) => {

        const { userId, productId, quantity } = req.body;

        try {
            const product = await cartModel.findOne({
                $and: [
                    {
                        productId: {
                            $eq: productId
                        }
                    },
                    {
                        userId: {
                            $eq: userId
                        }
                    }
                ]
            })
            if (product) {
                responseReturn(res, 400, { error: 'Product Already To Car !' })
            } else {
                const product = await cartModel.create({
                    userId,
                    productId,
                    quantity

                })
                responseReturn(res, 201, { message: 'Add to Cart Successfully', product })
            }

        } catch (errr) {
            responseReturn(res, 400, { error: 'Server error ' })
        }

    }

    get_card_products = async (req, res) => {
        const co = 5;
        const { userId } = req.params;
        try {
            const cart_products = await cartModel.aggregate([{
                $match: {
                    userId: {
                        $eq: new ObjectId(userId)
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: "_id",
                    as: 'products'
                }
            }

            ])
            let buy_product_item = 0;
            let calculatePrice = 0;
            let cart_product_count = 0;
            const outOfStockProduct = cart_products.filter(p => p.products[0].stock < p.quantity);

            for (let i = 0; i < outOfStockProduct; i++) {
                cart_product_count = cart_product_count + outOfStockProduct[i].quantity;
            }
            const StockProduct = cart_products.filter(p => p.products[0].stock >= p.quantity);


            for (let i = 0; i < StockProduct.length; i++) {
                const { quantity } = StockProduct[i];
                cart_product_count = buy_product_item + quantity;
                buy_product_item = buy_product_item + quantity;

                const { price, discount } = StockProduct[i].products[0];
                if (discount != 0) {
                    calculatePrice = calculatePrice + quantity * (price - Math.floor((price * discount) / 100));
                } else {
                    calculatePrice = calculatePrice + quantity * price;
                }
            }


            let p = [];
            let unique = [...new Set(StockProduct.map(p => p.products[0].sellerId.toString()))]
            for (let i = 0; i < unique.length; i++) {

                let price = 0;
                for (let j = 0; j < StockProduct.length; j++) {
                    let tempProduct = StockProduct[j].products[0];
                    if (unique[i] == tempProduct.sellerId.toString()) {
                        let pri = 0;
                        if (tempProduct.discount != 0) {
                            pri = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100);
                        } else {
                            pri = tempProduct.price;
                        }
                        pri = pri - Math.floor((pri * co) / 100);
                        price = price + pri * StockProduct[j].quantity;

                        p[i] = {
                            sellerId: unique[i],
                            shopName: tempProduct.shopName,
                            price,
                            products: p[i] ? [
                                ...p[i].products,
                                {
                                    _id: StockProduct[j]._id,
                                    quantity: StockProduct[j].quantity,
                                    productInfo: tempProduct
                                }
                            ] : [{
                                _id: StockProduct[j]._id,
                                quantity: StockProduct[j].quantity,
                                productInfo: tempProduct
                            }]
                        }

                    }

                }
            }

            responseReturn(res, 200,
                {
                    cart_products: p,
                    price: calculatePrice,
                    cart_product_count,
                    shipping_fee: 20 * p.length,
                    outofstock_products: outOfStockProduct,
                    buy_product_item
                })

        } catch (error) {
            console.log(error);
        }
    }
    delete_cart_products = async (req, res) => {
        const { cartId } = req.params;

        try {

            await cartModel.findByIdAndDelete(cartId);
            responseReturn(res, 200, { message: 'Product Remove Successfully' })

        } catch (err) {
            console.log(error.message)
        }

    }

    cart_quantity_increment = async (req, res) => {
        const { cartId } = req.params;
        try {
            const product = await cartModel.findById(cartId)
            const { quantity } = product
            await cartModel.findByIdAndUpdate(cartId, { quantity: quantity + 1 })
            responseReturn(res, 200, { message: "Qty Updated" })

        } catch (err) {
            console.log(err.message)
        }
    }
    cart_quantity_decrement = async (req, res) => {
        const { cartId } = req.params;
        try {
            const product = await cartModel.findById(cartId)
            const { quantity } = product
            await cartModel.findByIdAndUpdate(cartId, { quantity: quantity - 1 })
            responseReturn(res, 200, { message: "Qty Updated" })

        } catch (err) {
            console.log(err.message)
        }
    }
    add_to_wislist = async (req, res) => {

        const { slug } = req.body;
        try {
            const product = await wishlistModel.findOne({ slug })
            if (product) {
                responseReturn(res, 404, {
                    error: 'Product Is Already In Wishlist'
                })
            } else {
                await wishlistModel.create(req.body)
                responseReturn(res, 201, {
                    message: 'Product Add to Wishlist Success'
                })
            }

        } catch (errr) {
            responseReturn(res, 400, { error: 'Server error' })
        }

    }

    get_wishlist_products = async (req, res) => {
        const { userId } = req.params
        try {
            const wishlists = await wishlistModel.find({
                userId
            })
            responseReturn(res, 200, {  
                wishlistCount: wishlists.length,
                wishlists
            })
            
        } catch (error) {
            console.log(error.message)
        }
       } 

    remove_wishlist_product = async (req, res) => {
        const {wishlistId} = req.params
        try {
         const wishlist = await wishlistModel.findByIdAndDelete(wishlistId) 
         responseReturn(res, 200,{
             message: 'Wishlist Product Remove',
             wishlistId
         })
         
        } catch (error) {
         console.log(error.message)
        }
     }



}
module.exports = new cartController();