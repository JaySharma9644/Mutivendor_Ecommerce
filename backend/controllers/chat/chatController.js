    const cartModel = require("../../models/cartModel");
    const customerModel = require("../../models/customerModel");
    const sellerModel = require("../../models/sellerModel");
    const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
    const { responseReturn } = require("../../utils/response");
    const { mongo: { ObjectId } } = require("mongoose");
    const sellerCustomerMessageModel = require("../../models/chat/sellerCustomerMessageModel");

    class chartController {

        add_customer_friend = async (req, res) => {
            console.log(req.body)
            const { sellerId, userId } = req.body;

            try {
                if (sellerId != '') {
                    const seller = await sellerModel.findById(sellerId);
                    const user = await customerModel.findById(userId);
                    const checkSeller = await sellerCustomerModel.findOne({
                        $and: [
                            {
                                myId: {
                                    $eq: userId
                                }
                            },
                            {
                                myFrineds: {
                                    $elemMatch: {
                                        fdId: sellerId
                                    }
                                }
                            }
                        ]
                    })

                    if (!checkSeller) {
                        await sellerCustomerModel.updateOne({
                            myId: userId,

                        },
                            {
                                $push: {
                                    myFrineds: {
                                        fdId: sellerId,
                                        name: seller?.shopInfo?.shopName,
                                        image: seller?.image

                                    }
                                }
                            }

                        )
                    }


                    const checkCustomer = await sellerCustomerModel.findOne({
                        $and: [
                            {
                                myId: {
                                    $eq: sellerId
                                }
                            },
                            {
                                myFrineds: {
                                    $elemMatch: {
                                        fdId: userId
                                    }
                                }
                            }
                        ]
                    })

                    if (!checkCustomer) {
                        await sellerCustomerModel.updateOne({
                            myId: sellerId,

                        },
                            {
                                $push: {
                                    myFrineds: {
                                        fdId: userId,
                                        name: user.name,
                                        image: ''

                                    }
                                }
                            }

                        )
                    }

                    const messages = await sellerCustomerMessageModel.find({
                        $or: [
                            {
                                $and: [{
                                    receiverId: {
                                        $eq: sellerId
                                    }
                                }, {
                                    senderId: {
                                        $eq: userId
                                    }
                                }]
                            },
                            {

                                $and: [{
                                    receiverId: {
                                        $eq: userId
                                    }
                                }, {
                                    senderId: {
                                        $eq: sellerId
                                    }
                                }]
                            }
                        ]

                    })

                    const MyFriends = await sellerCustomerModel.findOne({
                        myId: userId
                    })

                    const currentFd = MyFriends.myFrineds.find(s => s.fdId === sellerId);


                    responseReturn(res, 200, {
                        MyFriends: MyFriends.myFrineds,
                        currentFd,
                        messages


                    })


                } else {
                    const MyFriends = await sellerCustomerModel.findOne({
                        myId: userId
                    })
                    responseReturn(res, 200, {
                        MyFriends: MyFriends.myFrineds


                    })
                }


            } catch (err) {
                console.log(err)
            }

        }

        add_customer_message = async (req, res) => {
            const { userId, text, sellerId, name } = req.body;

            try {

                const message = await sellerCustomerMessageModel.create({
                    senderName: name,
                    senderId: userId,
                    receiverId: sellerId,
                    message: text

                })
                const data = await sellerCustomerModel.findOne({
                    myId: userId
                })

                let myfriends = data?.myFrineds;
                let index = myfriends.findIndex(f => f.fdId == sellerId);

                while (index > 0) {
                    let temp = myfriends[index];
                    myfriends[index] = myfriends[index - 1];
                    myfriends[index - 1] = temp;
                    index--;
                }
                await sellerCustomerModel.updateOne({
                    myId: userId
                }, {
                    myfriends
                })



                const data1 = await sellerCustomerModel.findOne({
                    myId: sellerId
                })

                let myfriends1 = data1?.myFrineds;
                let index1 = myfriends1.findIndex(f => f.fdId == userId);

                while (index1 > 0) {
                    let temp1 = myfriends1[index1];
                    myfriends1[index1] = myfriends1[index1 - 1];
                    myfriends1[index1 - 1] = temp1;
                    index1--;
                }
                await sellerCustomerModel.updateOne({
                    myId: sellerId
                }, {
                    myfriends1
                })

                responseReturn(res, 200, { message })


            } catch (err) {
                console.log(err)
            }

        }

        get_customers = async (req, res) => {
            console.log(req.parmas)

            const { sellerId } = req.params;
            try {
                const data = await sellerCustomerModel.findOne({
                    myId: sellerId
                })

                responseReturn(res, 200, { customers: data?.myFrineds })
            } catch {
                console.log(err)
            }

        }
        get_customer_message = async (req, res) => {

            const { customerId } = req.params;
            const { id } = req;

            try {
                const messages = await sellerCustomerMessageModel.find({
                    $or: [
                        {
                            $and: [{
                                receiverId: {
                                    $eq: id
                                }
                            }, {
                                senderId: {
                                    $eq: customerId
                                }
                            }]
                        },
                        {

                            $and: [{
                                receiverId: {
                                    $eq: customerId
                                }
                            }, {
                                senderId: {
                                    $eq: id
                                }
                            }]
                        }
                    ]

                })
                const currentCustomer = await customerModel.findById(customerId);
                responseReturn(res, 200, { messages: messages, currentCustomer })
            } catch {
                console.log(err)
            }

        }
        add_seller_message = async (req, res) => {
            const { senderId, receiverId, text, name } = req.body;

            try {

                const message = await sellerCustomerMessageModel.create({
                    senderName: name,
                    senderId: senderId,
                    receiverId: receiverId,
                    message: text

                })
                const data = await sellerCustomerModel.findOne({
                    myId: senderId
                })

                let myfriends = data?.myFrineds;
                let index = myfriends.findIndex(f => f.fdId == receiverId);

                while (index > 0) {
                    let temp = myfriends[index];
                    myfriends[index] = myfriends[index - 1];
                    myfriends[index - 1] = temp;
                    index--;
                }
                await sellerCustomerModel.updateOne({
                    myId: senderId
                }, {
                    myfriends
                })



                const data1 = await sellerCustomerModel.findOne({
                    myId: receiverId
                })

                let myfriends1 = data1?.myFrineds;
                let index1 = myfriends1.findIndex(f => f.fdId == senderId);

                while (index1 > 0) {
                    let temp1 = myfriends1[index1];
                    myfriends1[index1] = myfriends1[index1 - 1];
                    myfriends1[index1 - 1] = temp1;
                    index1--;
                }
                await sellerCustomerModel.updateOne({
                    myId: receiverId
                }, {
                    myfriends1
                })

                responseReturn(res, 200, { message })


            } catch (err) {
                console.log(err)
            }

        }

        get_sellers = async (req,res) =>{
            const { id } = req; 

            try {
                const data  = await sellerModel.find({});
                responseReturn(res, 200, { sellers: data})


            }catch (err) {
                console.log(err)
            }
        }


    }
    module.exports = new chartController();