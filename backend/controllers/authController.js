
const adminModel = require('../models/adminModel');
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
    // End Method

    getUser = async (req, res) => {
        const { id, role } = req;


        try {
            if(role=='admin'){
                const user = await adminModel.findById(id);
                responseReturn(res,200,{userInfo:user})

            }else{
                console.log("Seller Info")
            }

        } catch (error) {
            console.log(error.message)
        }

    }
    // End Method
}

module.exports = new authControllers();