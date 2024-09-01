import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shops from './pages/Shops';
import Card from './pages/Card';
import Shipping from './pages/Shipping';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/shops' element={<Shops/>} />
    <Route path='/card' element={<Card/>} />
    <Route path='/shipping' element={<Shipping/>} />
    <Route path='/product/details/:slug' element={<Details/>} /> 
    <Route path='/register' element={<Register/>} /> 
    <Route path='/login' element={<Login/>} /> 




    </Routes>
    
    </BrowserRouter>
  );
}

export default App;