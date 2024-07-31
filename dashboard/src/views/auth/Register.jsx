import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register,messageClear } from '../../store/Reducers/authReducer';

const Register = () => {
    
    const dispatch  = useDispatch(); 

    const {loader} = useSelector(state=>state.auth)

    const [state, setState] = useState({
        name: '',
        email: '',
        password: ''
    });
    const inputHandler = (e) => {

        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(state);
        dispatch(seller_register(state))

    }
    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center'>
            <div className='w-[350px] text-[#ffffff] p-2'>
                <div className='bg-[#6f68d1] p-4 rounded-md'>
                    <h2 className='text-xl mb-3 font-bold'>Welcome To Eommerce</h2>
                    <p className='text-sm mb-3 font-medium'>Please Register Your Account</p>
                    <form  onSubmit={submit}>
                        <div className='flex flex-col w-full gap-1  mb-3'>
                            <label htmlFor='name'>Name</label>
                            <input onChange={inputHandler} value={state.name} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md '
                                type='text' name='name' placeholder='Name' id='name' required
                            />
                        </div>
                        <div className='flex flex-col w-full gap-1  mb-3'>
                            <label htmlFor='email'>Email</label>
                            <input onChange={inputHandler} value={state.email} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md '
                                type='email' name='email' placeholder='Email' id='email' required
                            />
                        </div>
                        <div className='flex flex-col w-full gap-1  mb-3'>
                            <label htmlFor='password'>Password</label>
                            <input onChange={inputHandler} value={state.password} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md '
                                type='password' name='password' placeholder='Password' id='password' required
                            />
                        </div>
                        <div className='flex items-center w-full  gap-3 mb-3'>
                            <input className='w-4 h-4 text-blue-600 overflow-hidden bg-gray-200 rounded border-gray-300 focus:ring-blue-500'
                                type='checkbox' name='checkbox' id='checkbox' required />
                            <label htmlFor='checkbox'>I Agree to Privacy Policy and Terms</label>
                        </div>
                        <button disabled={loader ? true :false} className='bg-slate-800 w-full hover:shadow-blue-300 hover:Shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                        {
                            loader ? <PropagateLoader  color='white'   cssOverride={overrideStyle}/> :'Sign Up '
                        }</button>
                        <div className='flex items-center mb-3 gap-3 justify-center'><p>Already Have An Account ? <Link className='font-bold' to='/login'>Log In</Link></p> </div>

                    </form>
                </div>
            </div>
        </div>
    )

}

export default Register;