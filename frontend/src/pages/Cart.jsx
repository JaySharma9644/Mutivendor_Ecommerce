import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_cart_products,delete_cart_products,messageClear,cart_quantity_increment,cart_quantity_decrement } from '../store/Reducers/cartReducer';
import toast from 'react-hot-toast';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { successMessage, errorMessage, cart_products, cart_product_count, price, shipping_fee, outofstock_products, buy_product_item } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.auth);


    useEffect(() => {
        if (userInfo) {
            dispatch(get_cart_products(userInfo.id))
        }

    }, [])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_cart_products(userInfo.id))
        }

    }, [successMessage])

    const increment =(quantity, stock, cartId) =>{
        const temp = quantity + 1;
        if (temp <= stock) {
            dispatch(cart_quantity_increment(cartId))
        }
    }

    const decrement =(quantity, cartId) =>{
        let temp =quantity- 1;
        if(temp>0){
            dispatch(cart_quantity_decrement(cartId)) 
        }

    }

    const redirect =() =>{
        navigate('/shipping',{
            state:{
                products:cart_products,
                price:price,
                shipping_fee:shipping_fee,
                items:buy_product_item
            }
        })
    }

    return (
        <div>
            <Header />
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-3xl font-bold'>Card Page </h2>
                            <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'>
                                    <IoIosArrowForward />
                                </span>
                                <span>Card </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16'>

                    {
                        cart_products.length > 0 || outofstock_products > 0 ? <div className='flex flex-wrap'>
                            <div className='w-[67%] md-lg:w-full'>
                                <div className='pr-3 md-lg:pr-0'>
                                    <div className='flex flex-col gap-3'>
                                        <div className='bg-white p-4'>
                                            <h2 className='text-md text-green-500 font-semibold'>Stock Products {cart_products?.length}</h2>
                                        </div>

                                        {
                                            cart_products.map((p, i) => <div className='flex bg-white p-4 flex-col gap-2' key={i}>
                                                <div className='flex justify-start items-center'>
                                                    <h2 className='text-md text-slate-600 font-bold'>{p?.shopName}</h2>
                                                </div>

                                                {
                                                    p?.products.map((pr, i) => <div className='w-full flex flex-wrap'>
                                                        <div className='flex sm:w-full gap-2 w-7/12'>
                                                            <div className='flex gap-2 justify-start items-center'>
                                                                <img className='w-[80px] h-[80px]' src={pr.productInfo.images[0]} alt="" />
                                                                <div className='pr-4 text-slate-600'>
                                                                    <h2 className='text-md font-semibold'>{pr?.productInfo?.name}</h2>
                                                                    <span className='text-sm'>Brand: {pr?.productInfo?.brand}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                                            <div className='pl-4 sm:pl-0'>
                                                                <h2 className='text-lg text-orange-500'>${pr?.productInfo?.price - Math.floor((pr?.productInfo?.price * pr?.productInfo?.discount) / 100)}</h2>
                                                                <p className='line-through'>${pr?.productInfo?.price}</p>
                                                                <p>-{pr?.productInfo?.discount}%</p>
                                                            </div>
                                                            <div className='flex gap-2 flex-col'>
                                                                <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                                                    <div className='px-3 cursor-pointer' onClick={()=>decrement(pr.quantity, pr._id)}>-</div>
                                                                    <div className='px-3'>{pr.quantity}</div>
                                                                    <div className='px-3 cursor-pointer' onClick={()=>increment(pr.quantity,pr.productInfo.stock, pr._id)}>+</div>
                                                                </div>
                                                                <button onClick={()=>dispatch(delete_cart_products(pr._id))} className='px-5 py-[3px] bg-red-500 text-white'>Delete</button>
                                                            </div>
                                                        </div>


                                                    </div>)
                                                }

                                            </div>)
                                        }

                                        {
                                            outofstock_products.length > 0 && <div className='flex flex-col gap-3'>
                                                <div className='bg-white p-4'>
                                                    <h2 className='text-md text-red-500 font-semibold'>Out of Stock {outofstock_products?.length}</h2>
                                                </div>

                                                <div className='bg-white p-4'>
                                                    {
                                                        outofstock_products?.products?.map((pr, i) => <div className='w-full flex flex-wrap'>
                                                            <div className='flex sm:w-full gap-2 w-7/12'>
                                                                <div className='flex gap-2 justify-start items-center'>
                                                                    <img className='w-[80px] h-[80px]' src={pr?.productInfo?.images[0]} alt="" />
                                                                    <div className='pr-4 text-slate-600'>
                                                                        <h2 className='text-md font-semibold'>={pr?.productInfo?.name} </h2>
                                                                        <span className='text-sm'>Brand: {pr?.productInfo?.brand}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='flex justify-between w-5/12 sm:w-full sm:mt-3'>
                                                                <div className='pl-4 sm:pl-0'>
                                                                    <h2 className='text-lg text-orange-500'>${pr?.productInfo?.price - Math.floor((pr?.productInfo?.price * pr?.productInfo?.discount) / 100)}</h2>
                                                                    <p className='line-through'>${pr?.productInfo?.price}</p>
                                                                    <p>-15%</p>
                                                                </div>
                                                                <div className='flex gap-2 flex-col'>
                                                                    <div className='flex bg-slate-200 h-[30px] justify-center items-center text-xl'>
                                                                        <div className='px-3 cursor-pointer' onClick={()=>decrement(pr.quantity, pr._id)}>-</div>
                                                                        <div className='px-3'>{pr?.productInfo?.quantity}</div>
                                                                        <div className='px-3 cursor-pointer' onClick={()=>increment(pr.quantity,pr.productInfo.stock, pr._id)}>+</div>
                                                                    </div>
                                                                    <button  className='px-5 py-[3px] bg-red-500 text-white'>Delete</button>
                                                                </div>
                                                            </div>


                                                        </div>)
                                                    }
                                                </div>

                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className='w-[33%] md-lg:w-full'>
                                <div className='pl-3 md-lg:pl-0 md-lg:mt-5'>
                                    {
                                        cart_products.length > 0 && <div className='bg-white p-3 text-slate-600 flex flex-col gap-3'>
                                            <h2 className='text-xl font-bold'>Order Summary</h2>
                                            <div className='flex justify-between items-center'>
                                                <span>{buy_product_item}Items </span>
                                                <span>${price} </span>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <span>Shipping Fee </span>
                                                <span>${shipping_fee} </span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <input className='w-full px-3 py-2 border border-slate-200 outline-0 focus:border-green-500 rounded-sm' type="text" placeholder='Input Vauchar Coupon' />
                                                <button className='px-5 py-[1px] bg-[#059473] text-white rounded-sm uppercase text-sm'>Apply</button>
                                            </div>

                                            <div className='flex justify-between items-center'>
                                                <span>Total</span>
                                                <span className='text-lg text-[#059473]'>${price+shipping_fee} </span>
                                            </div>
                                            <button onClick={()=>redirect()} className='px-5 py-[6px] rounded-sm hover:shadow-red-500/50 hover:shadow-lg bg-red-500 text-sm text-white uppercase '>
                                                Process to Checkout
                                            </button>

                                        </div>
                                    }   

                                </div>

                            </div>




                        </div>

                            : <div>
                                <Link className='px-4 py-1 bg-indigo-500 text-white' to='/shops' > Shop Now</Link>
                            </div>
                    }

                </div>

            </section>

            <Footer />
        </div>
    );
};

export default Cart;