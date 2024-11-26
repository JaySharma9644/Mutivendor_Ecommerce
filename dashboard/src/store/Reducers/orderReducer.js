import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 


export const get_admin_orders = createAsyncThunk(
    'orders/get_admin_orders',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/admin/order?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_seller_orders = createAsyncThunk(
    'orders/get_seller_orders',
    async({ parPage,page,searchValue,sellerId },{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/seller/order/${sellerId}?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_admin_order_details = createAsyncThunk(
    'orders/get_admin_order_details',
    async(orderId,{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/admin/get-order-details/${orderId}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)


export const admin_order_status_update  = createAsyncThunk(
    'orders/admin_order_status_update',
    async({orderId,info},{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.post(`/admin/order_status_update/${orderId}`,info,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_seller_order_details = createAsyncThunk(
    'orders/get_seller_order_details',
    async(orderId,{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/seller/get-order-details/${orderId}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)


export const seller_order_status_update  = createAsyncThunk(
    'orders/seller_order_status_update',
    async({orderId,info},{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.post(`/seller/order_status_update/${orderId}`,info,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)




  
 
export const orderReducer = createSlice({
    name: 'order',
    initialState:{
        orders: [],
        successMessage: '',
        totalOrders:0,
        errorMessage: '',
        order: {},
        loader: false
    },
    reducers : {

        messageClear : (state,_) => {
           state.errorMessage = ""
            state.successMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
            state.totalOrders =payload.totalOrders;
            state.orders =payload.orders;
        })
        .addCase(get_admin_order_details.fulfilled, (state, { payload }) => {
            state.order =payload.order;
        })
        .addCase(admin_order_status_update.fulfilled, (state, { payload }) => {
            state.successMessage =payload.message;
        })
        .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
            state.totalOrders =payload.totalOrders;
            state.orders =payload.orders;
        })
        .addCase(get_seller_order_details.fulfilled, (state, { payload }) => {
            state.order =payload.order;
        })
        .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
            state.successMessage =payload.message;
        })
        
    

    }

})
export const {messageClear} = orderReducer.actions
export default orderReducer.reducer