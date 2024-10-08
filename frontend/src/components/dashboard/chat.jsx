import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai'
import { GrEmoji } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { add_friend, send_message,messageClear,updateMessage} from '../../store/Reducers/chatReducer';
import toast from 'react-hot-toast';
const socket = io('http://localhost:5000/');

const Chat = () => {
    const scrollToRef = useRef();
    const dispatch = useDispatch();
    const { sellerId } = useParams();
    const { userInfo } = useSelector(state => state.auth);
    const { myFriends, fb_messages, current_Fd,successMessage, errorMessage } = useSelector(state => state.chat);
    const [text, setText] = useState('');
    const [receiverMessage, setReceiverMessage] = useState('');
    const [activeSellers, setActiveSellers] = useState([]);



    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo)
    })
    useEffect(() => {
        socket.on('seller_message', msg=>{
            setReceiverMessage(msg);
        })

        socket.on('activeSeller', sellers=>{
            setActiveSellers(sellers);
        })
      
    })

    useEffect(() => {
        dispatch(add_friend({
            sellerId: sellerId,
            userId: userInfo.id
        }))
    }, [sellerId])
  

    useEffect(() => {
        if (successMessage) {
           socket.emit('send_customer_message',fb_messages[fb_messages?.length -1]);
           dispatch(messageClear())
         

        }
       
    }, [successMessage])

    useEffect(() => {
         if(receiverMessage){
            if(sellerId===receiverMessage.senderId && userInfo.id ==receiverMessage?.receiverId){

                dispatch(updateMessage(receiverMessage));

            }else{
              toast.success(receiverMessage?.senderName  + " " + " Send A Message" );
              dispatch(messageClear())
            }
         }
    }, [receiverMessage])


    useEffect(() => {

        scrollToRef.current?.scrollIntoView({behavior:'smooth'});
    },[fb_messages])

    const send = () => {
        if (text && text?.trim() != "") {

            dispatch(send_message({
                userId: userInfo?.id,
                text,
                sellerId: sellerId,
                name: userInfo?.name

            }))
            setText("");
        }
    }

    return (
        <div className='bg-white p-3 rounded-md'>
            <div className='w-full flex'>
                <div className='w-[230px]'>
                    <div className='flex justify-center gap-3 items-center text-slate-600 text-xl h-[50px]'>
                        <span><AiOutlineMessage /></span>
                        <span>Message</span>
                    </div>
                    <div className='w-full flex flex-col text-slate-600 py-4 h-[400px] pr-3'>
                        {
                            myFriends && myFriends.length > 0 && myFriends?.map((friend, i) =>


                                friend?.name != '' ? (<Link key={i} to={`/dashboard/chat/${friend.fdId}`} className={`flex gap-2 justify-start items-center pl-2 py-[5px]`} >
                                    <div className='w-[30px] h-[30px] rounded-full relative'>
                                        {
                                            activeSellers.some(c=>c.sellerId===friend.fdId) &&  
                                            <div className='w-[10px] h-[10px] rounded-full
                                             bg-green-500 absolute right-0 bottom-0'></div>

                                        }

                                        <img src={friend?.image} alt="" />
                                    </div>
                                    <span>{friend?.name}</span>
                                </Link>) : <></>

                            )
                        }


                    </div>
                </div>
                <div className='w-[calc(100%-230px)]'>
                    {
                        current_Fd ? <div className='w-full h-full'>
                            <div className='flex justify-start gap-3 items-center text-slate-600 text-xl h-[50px]'>
                                <div className='w-[30px] h-[30px] rounded-full relative'>
                                {
                                    activeSellers?.some(c=>c.sellerId===current_Fd.fdId) &&  
                                    <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div>


                                }

                                    <img src={current_Fd?.image} alt="" />
                                </div>
                                <span>{current_Fd?.name}</span>
                            </div>
                            <div className='h-[400px] w-full bg-slate-100 p-3 rounded-md'>
                                <div className='w-full h-full overflow-y-auto flex flex-col gap-3'>
                                    {
                                        fb_messages.map((fb, i) => {

                                            if (current_Fd?.fdId !== fb.receiverId) {

                                                return (
                                                    <div className='w-full flex gap-2 justify-start items-center text-[14px]' key={i} ref={scrollToRef}>
                                                        <img className='w-[30px] h-[30px] ' src="http://localhost:3000/images/user.png" alt="" />
                                                        <div className='p-2 bg-purple-500 text-white rounded-md'>
                                                            <span>{fb?.message}</span>
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className='w-full flex gap-2 justify-end items-center text-[14px]' key={i} ref={scrollToRef}>
                                                        <img className='w-[30px] h-[30px] ' src="http://localhost:3000/images/user.png" alt="" />
                                                        <div className='p-2 bg-cyan-500 text-white rounded-md'>
                                                            <span>{fb?.message}</span>
                                                        </div>
                                                    </div>

                                                )

                                            }

                                        })
                                    }




                                </div>
                            </div>
                            <div className='flex p-2 justify-between items-center w-full'>
                                <div className='w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full'>
                                    <label className='cursor-pointer' htmlFor=""><AiOutlinePlus /></label>
                                    <input className='hidden' type="file" />
                                </div>
                                <div className='border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative'>
                                    <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder='input message' className='w-full rounded-full h-full outline-none p-3' />
                                    <div className='text-2xl right-2 top-2 absolute cursor-auto'>
                                        <span><GrEmoji /></span>
                                    </div>

                                </div>
                                <div className='w-[40px] p-2 justify-center items-center rounded-full' onClick={(e) => send()}>
                                    <div className='text-2xl cursor-pointer'>
                                        <IoSend />
                                    </div>
                                </div>
                            </div>
                        </div> : <div className='w-full h-full flex justify-center items-center text-lg ont-bold text-slate-600'>
                            <span>select seller</span>
                        </div>

                    }

                </div>
            </div>
        </div>
    );
};

export default Chat;