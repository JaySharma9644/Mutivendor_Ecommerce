const formidable = require("formidable");
const cloudinary = require('cloudinary').v2;
const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel')
const { responseReturn } = require('../utils/response');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/tokenCreate')

class authControllers {

    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {

            const admin = await adminModel.findOne({ email }).select('+password');
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                console.log(match)
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role,

                    })

                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: "Login Success" })

                } else {
                    responseReturn(res, 500, { error: "Password Not Matched" })
                }


            } else {
                responseReturn(res, 500, { error: "Email Not Found" })
            }
        }

        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }


    }

    admin_register = async (req, res) => {
        const { email, name, password } = req.body;
       

        try {
            const getUser = await adminModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email Already Exit' })
            } else {
                const admin = await adminModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    image:'http://res.cloudinary.com/dqnzypoze/image/upload/v1722920427/categories/lz7ri6onu1bmmwqxw32i.jpg'
                })
               
                const token = await createToken({
                    id: admin.id,
                    role: admin.role

                })
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { token,message: 'Register Success' })
            }
        } catch (err) {
            
            responseReturn(res, 500, {error: err })
        }
        
    }
    // End Method

    getUser = async (req, res) => {
        const { id, role } = req;


        try {
            if (role == 'admin') {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user })

            } else {
                const user = await sellerModel.findById(id);
                responseReturn(res, 200, { userInfo: user })
            }

        } catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error!' })
        }

    }
    // End Method

    seller_register = async (req, res) => {
        const { email, name, password } = req.body;

        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email Already Exit' })
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manually',
                    shopInfo: {}
                })
                await sellerCustomerModel.create({
                    myId:seller.id,

                })
                const token = await createToken({
                    id: seller.id,
                    role: seller.role

                })
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                responseReturn(res, 201, { token,message: 'Register Success' })
            }
        } catch (err) {
            responseReturn(res, 500, {error: 'Internal Server Error' })
        }
        console.log(email);
    }
    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {

            const seller = await sellerModel.findOne({ email }).select('+password');
            if (seller) {
                const match = await bcrypt.compare(password, seller.password);
                console.log(match)
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role,

                    })

                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })

                    responseReturn(res, 200, { token, message: "Login Success" })

                } else {
                    responseReturn(res, 500, { error: "Password Not Matched" })
                }


            } else {
                responseReturn(res, 500, { error: "Email Not Found" })
            }
        }

        catch (error) {
            responseReturn(res, 500, { error: error.message })
        }


    }
    // End Method

    profile_image_upload = async(req, res) => {
        const {id} = req
        console.log(id);
        const form = formidable({ multiples: true })
        form.parse(req, async(err,_,files) => {
                cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })
            const { image } = files

            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile'})
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url
                    }) 
                    const userInfo = await sellerModel.findById(id)
                    responseReturn(res, 201,{ message : 'Profile Image Upload Successfully',userInfo})
                } else {
                    responseReturn(res, 404,{ error : 'Image Upload Failed'})
                }
                
            } catch (error) {
                responseReturn(res, 500,{ error : error.message })
            }
 

        })
    }

    // End Method
    profile_info_add = async(req, res) => {
        const {id} = req
        try {
            let { division, district, shopName, subDistrict } = req.body;
            const result = await sellerModel.findByIdAndUpdate(id,{shopInfo:{ division, district, shopName, subDistrict }})
            const userInfo = await sellerModel.findById(id)
            responseReturn(res, 201,{ message : 'User Info Updated Successfully',userInfo})

        }catch(err){
            responseReturn(res, 500,{ error : error.message })
        }

    }
}

module.exports = new authControllers();