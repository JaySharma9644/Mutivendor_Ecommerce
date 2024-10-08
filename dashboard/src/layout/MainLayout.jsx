import {React,useEffect,useState} from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideBar from './Sidebar';
import {socket} from '../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { update_customers, update_sellers } from '../store/Reducers/chatReducer';

const MainLayout = () => {
    // eslint-disable-next-line no-undef
    const dispatch = useDispatch();
    const [showSidebar, setShowSidebar] = useState(false)
    const {userInfo} = useSelector(state=>state.auth);

    useEffect(()=>{
        if(userInfo && userInfo.role==="seller"){
            socket.emit('add_seller',userInfo._id,userInfo);
        }else{
            socket.emit('add_admin',userInfo);
        }

    },[userInfo])

    useEffect(() => {
        socket.on('activeCustomers', customers=>{
            dispatch(update_customers(customers))
        })
        socket.on('activeSeller', allSellers=>{
            dispatch(update_sellers(allSellers))
        })
      
    },[])
    return (
        <div className='bg-[#cdcae9] w-full min-h-screen'>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <SideBar  showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>

           <div className='ml-0 lg:ml-[260px] pt-[95px] transition-all'>
           <Outlet/>
           </div>
        </div>
    );
};

export default MainLayout;