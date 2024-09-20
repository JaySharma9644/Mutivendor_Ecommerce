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





    </Routes>
    
    </BrowserRouter>
  );
}

export default App;