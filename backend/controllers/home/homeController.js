const { responseReturn } = require("../../utils/response");
const { mongo: { ObjectId } } = require("mongoose");
const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const queryProducts = require('../../utils/queryProducts');
const reviewModel = require("../../models/reviewModel");
const moment = require('moment');
class homeController {

    formateProduct = (products) => {

        const ProductArray = [];
        let i = 0;
        while (i < products.length) {
            let temp = [];
            let j = 1

            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j])
                }
                j++;
            }
            ProductArray.push([...temp])
            i = j;

        }
        return ProductArray;
    }

    get_category = async (req, res) => {
        try {
            const categories = await categoryModel.find({});

            const totalCategory = await categoryModel.find({}).countDocuments()
            responseReturn(res, 200, { categories, totalCategory })

        } catch (error) {
            console.log(error.message)
        }
    }
    get_products = async (req, res) => {
        try {
            const products = await productModel.find({}).limit().sort({ createdAt: -1 });

            const allProducts1 = await productModel.find({}).limit(9).sort({ createdAt: -1 });
            const latest_products = this.formateProduct(allProducts1);

            const allProducts2 = await productModel.find({}).limit(9).sort({ rating: -1 });
            const topRated_products = this.formateProduct(allProducts2);

            const allProducts3 = await productModel.find({}).limit(9).sort({ doscoun: -1 });
            const discount_products = this.formateProduct(allProducts2);

            const totalProduct = await productModel.find({}).countDocuments();
            responseReturn(res, 200, { products, latest_products, topRated_products, discount_products, totalProduct })

        } catch (error) {
            console.log(error.message)
        }
    }
    get_price_range_product = async (req, res) => {
        try {
            let priceRange = {
                low: 0,
                high: 100
            }
            const products = await productModel.find({}).limit(9).sort({ createdAt: -1 });
            const latest_products = this.formateProduct(products);
            const getForPrice = await productModel.find({}).limit(9).sort({ price: 1 });

            if (getForPrice.length > 0) {
                priceRange.high = getForPrice[getForPrice.length - 1]?.price;
                priceRange.low = getForPrice[0]?.price;

            }



            responseReturn(res, 200, { latest_products, priceRange })

        } catch (error) {
            console.log(error.message)
        }
    }
    query_products = async (req, res) => {
        const perPage = 12;
        req.query.perPage = perPage;

        try {
            const products = await productModel.find({}).sort({
                createdAt: -1
            })
            const totalProducts = new queryProducts(products, req.query).categoryQuery().ratingQuery().searchQuery().priceQuery().sortByPrice().countProducts();

            const result = new queryProducts(products, req.query).categoryQuery().ratingQuery().priceQuery().searchQuery().sortByPrice().limit().skip().getProducts();

            responseReturn(res, 200, { products: result, totalProduct: totalProducts, perPage })
        } catch (error) {
            console.log(error.message)
        }
    }
    product_details = async (req, res) => {

        const { slug } = req.params;
        try {

            const product = await productModel.findOne({ slug });

            const relatedProducts = await productModel.find({
                $and: [{
                    _id: {
                        $ne: product._id
                    }
                },
                {
                    category: {
                        $eq: product.category
                    }
                }


                ]
            }).limit(12);

            const moreProducts = await productModel.find({
                $and: [{
                    _id: {
                        $ne: product._id
                    }
                },
                {
                    sellerId: {
                        $eq: product.sellerId
                    }
                }


                ]
            }).limit(3);

            responseReturn(res, 200, {
                product,
                relatedProducts,
                moreProducts
            })

        } catch (error) {
            console.log(error.message)
        }

    }


    submit_review = async (req, res) => {
        const { productId, rating, review, name } = req.body
        try {
            await reviewModel.create({
                productId,
                name,
                rating,
                review,
                date: moment(Date.now()).format('LL')
            })

            let rate = 0;
            const reviews = await reviewModel.find({
                productId
            });

            for (let i = 0; i < reviews.length; i++) {
                rate = rate + reviews[i].rating;

            }
            let productRating = 0;

            if (reviews && reviews.length != 0) {
                productRating = (rate / reviews.length).toFixed(1);
            }

            await productModel.findByIdAndUpdate(productId, {
                rating: productRating
            })
            responseReturn(res, 200, { message: 'Reviews Update Successfully' })
        } catch (error) {
            console.log(error.message)
        }
    }

    get_product_reviews = async (req, res) => {

        const { productId } = req.params;
        const { pageNo } = req.query;
        const limit = 5;
        const skipPage = limit * (pageNo - 1);
        try {

            let getRating = await reviewModel.aggregate([{
                $match: {
                    productId: {
                        $eq : new ObjectId(productId)
                    },
                    rating: {
                        $not: {
                            $size: 0
                        }
                    }
                }
            },
            {
                $unwind: "$rating"
            },
            {
                $group: {
                    _id: "$rating",
                    count: {
                        $sum: 1
                    }
                }
            } 
        ])

            let rating_review = [
                {
                    rating: 5,
                    sum: 0
                },
                {
                    rating: 4,
                    sum: 0
                },
                {
                    rating: 3,
                    sum: 0
                },
                {
                    rating: 2,
                    sum: 0
                },
                {
                    rating: 1,
                    sum: 0
                },

            ]


            for(let i=0;i<rating_review?.length;i++){
                for(let  j=0;j< getRating?.length;j++){
                    if(rating_review[i].rating=== getRating[j]._id){
                        rating_review[i].sum  = getRating[j].count;
                        break;
                    }
                }
            }

            const getAll = await reviewModel.find({
                productId
            });
            const reviews =await reviewModel.find({
                productId
            }).skip(skipPage).limit(limit).sort({createdAt:-1})

            responseReturn(res, 200, {
                reviews,
                totalReview:getAll.length,
                rating_review

            })
        } catch (error) {
            console.log(error.message)
        }

    }




}
module.exports = new homeController();