import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import CategoryShop from './pages/CategoryShop';
import SearchProducts from './pages/SearchProducts';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import ProtectUser from './utils/ProtectUser';
import Orders from './components/dashboard/Orders';
import ChangePassword from './components/dashboard/changePassword';
import Wishlist from './components/dashboard/wishlist';
import Index from './components/dashboard/index';
import OrderDetails from './components/dashboard/orderDetails';
import Chat from './components/dashboard/chat';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/shops' element={<Shops/>} />
    <Route path='/cart' element={<Cart/>} />
    <Route path='/shipping' element={<Shipping/>} />
    <Route path='/product/details/:slug' element={<Details/>} /> 
    <Route path='/register' element={<Register/>} /> 
    <Route path='/login' element={<Login/>} /> 
    <Route path='/products?' element={<CategoryShop/>} /> 
    <Route path='/products/search?' element={<SearchProducts/>} /> 
    <Route path='/payment' element={<Payment/>} /> 
    <Route path='/dashboard' element={<ProtectUser/>} >
      <Route path='' element={<Dashboard/>} >
      <Route path='' element={<Index/>} />
      <Route path='my-orders' element={<Orders/>} /> 
      <Route path='change-password' element={<ChangePassword/>} /> 
      <Route path='my-Wishlist' element={<Wishlist/>} /> 
      <Route path='order/details/:orderId' element={<OrderDetails/>} /> 
      <Route path='chat' element={<Chat/>} /> 
      <Route path='chat/:sellerId' element={<Chat/>} /> 
       </Route> 
      </Route>





    </Routes>
    
    </BrowserRouter>
  );
}

export default App;