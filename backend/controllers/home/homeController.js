const { responseReturn } = require("../../utils/response");
const categoryModel = require('../../models/categoryModel');
const productModel =require('../../models/productModel');
class homeController {

    formateProduct =(products)=>{

        const ProductArray = [];   
        let i =0;
        while(i<products.length){
            let temp = [];
            let j= 1 

            while(j<i+3){
                if(products[j]){
                    temp.push(products[j])  
                }
                j++;
            }
            ProductArray.push([...temp])
            i=j;

        }
         return ProductArray;
    }

    get_category = async (req, res) => {
        try {
            const categories = await categoryModel.find({ });
           
            const totalCategory = await categoryModel.find({ }).countDocuments()
            responseReturn(res, 200,{categories,totalCategory}) 
             
         }catch (error) {
             console.log(error.message)
        }
    }
     get_products = async (req, res) => {
        try {
            const products = await productModel.find({ }).limit().sort({createdAt:-1});

            const allProducts1 = await productModel.find({ }).limit(9).sort({createdAt:-1});
            const latest_products = this.formateProduct(allProducts1);

            const allProducts2 = await productModel.find({ }).limit(9).sort({rating:-1});
            const topRated_products = this.formateProduct(allProducts2);

            const allProducts3 = await productModel.find({ }).limit(9).sort({doscoun:-1});
            const discount_products = this.formateProduct(allProducts2);

            const totalProduct = await productModel.find({ }).countDocuments();
            responseReturn(res, 200,{products,latest_products,topRated_products,discount_products,totalProduct}) 
             
         }catch (error) {
             console.log(error.message)
        }
    }
    get_price_range_product = async (req, res) => {
        try {
             let priceRange={
                low:0,
                high:100
             }
            const products = await productModel.find({ }).limit(9).sort({createdAt:-1});
            const latest_products =this.formateProduct(products);
            const getForPrice = await productModel.find({ }).limit(9).sort({price:1});
            if(getForPrice.length>0){
                priceRange.high =getForPrice[getForPrice.length-1];
                priceRange.low =getForPrice[0];
                
            }
        
           
           
            responseReturn(res, 200,{latest_products,priceRange}) 
             
         }catch (error) {
             console.log(error.message)
        }
    }

}
module.exports = new homeController();