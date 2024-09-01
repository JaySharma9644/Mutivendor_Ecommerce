import React, { useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import FeatureProducts from '../components/products/FeatureProducts';
import Products from '../components/products/Products';
import Categorys from '../components/Category';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import {get_products } from '../store/Reducers/homeReducer';

const Home = () => {

    const dispatch  = useDispatch();
    const {products,latest_products,topRated_products,discount_products} = useSelector(state=> state.home)
    useEffect(()=>{
        dispatch(get_products())  
    },[])
    return (
        <div className='w-full'>
            <Header />
            <Banner/>
            <Categorys  />
            <div className='py-[45px]'>
            <FeatureProducts  products={products}/>
            </div>
           
            <div className='py-10'>
                <div className='w-[85%] flex flex-wrap mx-auto'>
                    <div className='grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7'>
            <div className='overflow-hidden'>
                <Products  products={latest_products} title='Latest Product' />
            </div>
            
            <div className='overflow-hidden'>
                <Products products={topRated_products}  title='Top Rated Product'/>
            </div>

            <div className='overflow-hidden'>
                <Products products={discount_products} title='Discount Product'/>
            </div>

                    </div> 
                </div> 
            </div>
            <Footer/>

        </div>
    );
};

export default Home;