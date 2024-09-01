const formidable = require("formidable");
const { responseReturn } = require("../../utils/response");
const sellerModel = require('../../models/sellerModel');

class sellerController {

    seller_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query;

        try{
            let skipPage = ''
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1)
            }
            if (searchValue && page && parPage) {
                const sellers = await sellerModel.find({
                    $text: { $search: searchValue }
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSellers = await sellerModel.find({
                    $text: { $search: searchValue }
                }).countDocuments()
                responseReturn(res, 200, { sellers, totalSellers })
            } else if (searchValue === '' && page && parPage) {

                const sellers = await sellerModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalSellers = await sellerModel.find({}).countDocuments()
                responseReturn(res, 200, { sellers, totalSellers })
            } else {
                const sellers = await sellerModel.find({}).sort({ createdAt: -1 })
                const totalSellers = await sellerModel.find({}).countDocuments()
                responseReturn(res, 200, { sellers, totalSellers})

            }

        }catch{
            responseReturn(res, 500, { error: error.message });
        }

    }

    get_seller = async (req, res) => {
        const { sellerId } = req.params;
        try {
            const seller = await sellerModel.findById(sellerId);
            responseReturn(res, 200, { seller })

        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }

    }
    seller_status_update = async (req, res) => {
        let { status, sellerId } = req.body;
        try {
            await sellerModel.findByIdAndUpdate(sellerId, {
                status
            })
            const seller = await sellerModel.findById(sellerId)
            responseReturn(res, 200, { seller, message: 'Seller Status Updated Successfully' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }

    }



}

module.exports = new sellerController();