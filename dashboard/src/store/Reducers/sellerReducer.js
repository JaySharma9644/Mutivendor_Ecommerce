import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 


export const get_sellers = createAsyncThunk(
    'seller/get_sellers',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/request-seller-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_seller = createAsyncThunk(
    'seller/get_seller',
    async(sellerId,{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/seller-get/${sellerId}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const seller_status_update= createAsyncThunk(
    'seller/seller_status_update=',
    async(info,{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.post('/seller-status-update/',info,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_active_sellers = createAsyncThunk(
    'seller/get_active_sellers',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/get-active-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_deactive_sellers = createAsyncThunk(
    'seller/get_deactive_sellers',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        try {
             
            const {data} = await api.get(`/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)




  
 
export const sellerReducer = createSlice({
    name: 'seller',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        sellers : [],
        totalSellers:0,
        seller:{}
    },
    reducers : {

        messageClear : (state,_) => {
           state.errorMessage = ""
            state.successMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(get_sellers.pending, (state, { payload }) => {
            state.loader = true;
        })
        .addCase(get_sellers.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        }) 
        .addCase(get_sellers.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.sellers = payload.sellers;
            state.totalSellers =payload.totalSellers

        }) 
        .addCase(get_seller.fulfilled, (state, { payload }) => {
            state.seller =payload.seller;
            
        })
        .addCase(seller_status_update.pending, (state, { payload }) => {
            state.loader = true;
        })
        .addCase(seller_status_update.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload.error;
        }) 
        .addCase(seller_status_update.fulfilled, (state, { payload }) => {
            state.seller =payload.seller;
            state.loader = false;
            state.successMessage = payload.message;
        }) 
        .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
            state.sellers =payload.sellers;
            state.totalSellers = payload.totalSellers;
           
        }) 
        .addCase(get_deactive_sellers.fulfilled, (state, { payload }) => {
            state.sellers =payload.sellers;
            state.totalSellers = payload.totalSellers;
           
        }) 
         

        
      
 

    }

})
export const {messageClear} = sellerReducer.actions
export default sellerReducer.reducer