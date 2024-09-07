const formidable = require("formidable");
const { responseReturn } = require("../../utils/response");
const cloudinary = require('cloudinary').v2;
const productModel = require('../../models/productModel');

class productController {
    add_product = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                responseReturn(res, 404, { error: 'Something went wrong' })
            } else {

                let { name, category, description, stock, price, discount, shopName, brand } = fields;
                const { images } = files;
                name = name.trim();
                const slug = name.split(" ").join("-");
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })

                try {
                    let allImageUrl = [];

                    for (let index = 0; index < images.length; index++) {
                        const result = await cloudinary.uploader.upload(images[index].filepath, { folder: 'products' })

                        allImageUrl = [...allImageUrl, result.url]


                    }
                    console.log(allImageUrl);
                    const products = await productModel.create({
                        sellerId: id,
                        name,
                        slug,
                        category: category.trim(),
                        brand,
                        price: parseInt(price),
                        stock: parseInt(stock),
                        discount: parseInt(discount),
                        description: description.trim(),
                        shopName,
                        images: allImageUrl
                    })
                    responseReturn(res, 201, { products, message: 'product added successfully!' })


                } catch (error) {
                    console.log(error)
                    responseReturn(res, 500, { error: error.message });
                }

            }

        })


    }
    get_product = async (req, res) => {

        const { page, searchValue, parPage } = req.query;
        try {
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }


            if (searchValue && page && parPage) {
                const products = await productModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalProduct = await productModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { products, totalProduct })
            } else if (searchValue === '' && page && parPage) {

                const products = await productModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalProduct = await productModel.find({}).countDocuments()
                responseReturn(res, 200, { products, totalProduct })
            } else {
                const products = await productModel.find({}).sort({ createdAt: -1 })
                const totalProduct = await productModel.find({}).countDocuments()
                responseReturn(res, 200, { products, totalProduct })

            }

        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }

    }
    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product })

        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }

    }
    product_update = async (req, res) => {
        let { name, description, stock, price, discount, brand, productId } = req.body;
        name = name.trim()
        const slug = name.split(' ').join('-')

        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, stock, price, discount, brand, productId, slug
            })
            const product = await productModel.findById(productId)
            responseReturn(res, 200, { product, message: 'Product Updated Successfully' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }

    }
    product_image_update = async (req, res) => {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            let { oldImage, productId } = fields;
            let { newImage } = files
            if (err) {
                responseReturn(res, 404, { error: 'Something went wrong' })
            } else {

                try {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    })
                    const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' })

                    if (result) {
                        let { images } = await productModel.findById(productId);
                        const index = images.findIndex(img => img == oldImage);
                        if (index >= 0) {
                            images[index] = result.url;
                        }

                        await productModel.findByIdAndUpdate(productId, { images });

                        const product = await productModel.findById(productId)
                        responseReturn(res, 200, { product, message: 'Product image Updated Successfully' })


                    }
                } catch (error) {
                    responseReturn(res, 500, { error: error.message })
                }
            }
        })


    }


}
module.exports = new productController();