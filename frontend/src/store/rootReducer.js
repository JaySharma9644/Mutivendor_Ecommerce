import authReducer from "./Reducers/authReducer";
import cartReducer from "./Reducers/cartReducer";
import homeReducer from "./Reducers/homeReducer";
import orderReducer from "./Reducers/orderReducer";


const rootReducer = {
    home: homeReducer,
    auth:authReducer,
    cart:cartReducer,
    order:orderReducer
   
}
export default rootReducer;