const {Schema,model} = require('mongoose');


const sellerCustomerSchema = new Schema({
    myId: {
        type: String,
        required : true
    },
    myFrineds: {
        type: Array,
        default:[]
    },
},{ timestamps: true })

module.exports =model('seller_customers',sellerCustomerSchema);