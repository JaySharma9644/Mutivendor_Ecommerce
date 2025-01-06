const stripeModel = require('../models/stripeModel');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51QQ1OeBI0RzXsuRVkR41OvuP791GB9XvDJIy9etgu98TcHAAwDYoREM18yr7YD1awSbC7eG8VA2BIZpPinhaxnpM00m3Miyt6Y')
const { responseReturn } = require('../utils/response');
const sellerModel = require('../models/sellerModel');
const { mongo: { ObjectId } } = require("mongoose");
const withdrawRequest = require('../models/withDrawRequestModel');
const sellerWallet = require('../models/sellerWallet');
class paymentControllers {

    sumAmount = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i]?.amount;
        }

        return sum;
    }
    create_stripe_connect_account = async (req, res) => {
        const { id } = req;
        const uid = uuidv4();
        try {

            const stripeInfo = await stripeModel.findOne({ sellerId: id });
            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id });
                const account = await stripe.accounts.create({ type: "express" });
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: "http://localhost:3000/refresh",
                    return_url: `http://localhost:3000/success?activeCode=${uid}`,
                    type: "account_onboarding"

                })

                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })
            } else {
                const account = await stripe.accounts.create({ type: "express" });
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: "http://localhost:3000/refresh",
                    return_url: `http://localhost:3000/success?activeCode=${uid}`,
                    type: "account_onboarding"

                })

                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })
            }
        }

        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }


    }
    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params
        const { id } = req
        try {
            const userStripeInfo = await stripeModel.findOne({ code: activeCode })
            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                })
                responseReturn(res, 200, { message: 'payment Active' })
            } else {
                responseReturn(res, 404, { message: 'payment Active Fails' })
            }
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    get_seller_payment_details = async (req, res) => {
        const { sellerId } = req.params;

        try {

            const payments = await sellerWallet.find({ sellerId });

            const pendingWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'pending'
                        }
                    }
                ]
            })
            const successWithdraws = await withdrawRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    },
                    {
                        status: {
                            $eq: 'success'
                        }
                    }
                ]
            })

            const pendingAmount = this.sumAmount(pendingWithdraws);
            const withDrawAmount = this.sumAmount(successWithdraws);
            const totalAmount = this.sumAmount(payments);

            let availableAmount = 0;
            if (totalAmount > 0) {
                availableAmount = totalAmount - (pendingAmount + withDrawAmount);
            }

            responseReturn(res, 200, {
                totalAmount,
                pendingAmount,
                withDrawAmount,
                availableAmount,
                pendingWithdraws,
                successWithdraws
            })
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    seller_withdraw_request = async (req, res) => {
        const { amount, sellerId } = req.body;
        try {
            const withdrawl = await withdrawRequest.create({
                sellerId,
                amount: parseInt(amount),
            })

            responseReturn(res,200, { withdrawl, message: 'Withdrawl Request Sent' })
        } catch (error) {

            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    get_payment_request = async (req, res) => { 
        try{
           const withdrawalRequest = await withdrawRequest.find({status:'pending'})  ;

           responseReturn(res,200,{withdrawalRequest})
        }catch(error){
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
    payment_request_confirm = async (req, res) => { 
        const{paymentId} = req.body;
        try{
         const payment=   await withdrawRequest.findById(paymentId);
         const {stripeId} = await stripeModel.findOne({
            sellerId: new ObjectId(payment.sellerId)
         })

         await stripe.transfers.create({  
            amount:payment.amount*10,
            currency:'usd',
            destination:stripeId

         })

         await withdrawRequest.findByIdAndUpdate(paymentId,{status:'success'});
         responseReturn(res,200,{payment,message:'Request Confirm Success'});


        }catch(error){
            responseReturn(res, 500, { message: 'Internal Server Error' })
        }
    }
}

module.exports = new paymentControllers();