import { lazy } from "react";
import AdminRegister from "../../views/auth/AdminRegister";
const Login = lazy(()=>import('../../views/auth/Login'))
const Register = lazy(()=>import('../../views/auth/Register'));
const AdminLogin = lazy(()=>import('../../views/auth/AdminLogin'));
const Home = lazy(()=>import('../../views/Home'));
const Unauthorised = lazy(()=>import('../../views/unauthorised'));


const PublicRoutes = [
    {
        path: '/',
        element : <Home/>,
    },
    {
        path:'/login',
        element:<Login/>
    },{
        path:'/register',
        element:<Register/>
    },
    {
        path:'/admin/login',
        element:<AdminLogin/>
    },
    {
        path:'/admin/register',
        element:<AdminRegister/>
    },
    {
        path:'/unauthorised',
        element:<Unauthorised/>
    }
]

export default PublicRoutes;