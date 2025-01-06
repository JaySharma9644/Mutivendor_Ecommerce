import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";



export const get_seller_payment_details = createAsyncThunk(
    'payment/get_seller_payment_details',
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/payment/get_seller_payment_details/${sellerId}`, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const send_withdrawal_request = createAsyncThunk(
    'payment/send_withdrawal_request',
    async( info,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.post(`/payment/withdrawal-request`,info,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 

export const get_payment_request = createAsyncThunk(
    'payment/get_payment_request',
    async( _,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.get(`/payment/get_payment_request`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 
export const payment_request_confirm = createAsyncThunk(
    'payment/payment_request_confirm',
    async(paymentId ,{rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data} = await api.post('/payment/payment_request_confirm',{paymentId},{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
) 
export const paymentReducer = createSlice({
    name: 'payment',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        pendingWithdraws: [],
        successWithdraws: [],
        totalAmount: 0,
        withDrawAmount: 0,
        pendingAmount: 0,
        availableAmount: 0

    },
   reducers : {
        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_seller_payment_details.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(get_seller_payment_details.rejected, (state, { payload }) => {
                state.loader = false;
            })
            .addCase(get_seller_payment_details.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.totalAmount = payload.totalAmount;
                state.pendingAmount = payload.pendingAmount;
                state.withDrawAmount = payload.withDrawAmount;
                state.availableAmount = payload.availableAmount;
                state.pendingWithdraws = payload.pendingWithdraws;
                state.successWithdraws = payload.successWithdraws;

            })
            .addCase(send_withdrawal_request.pending, (state, { payload }) => {
                state.loader = true;
                
               
            })
            .addCase(send_withdrawal_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;

            })

            .addCase(send_withdrawal_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.pendingWithdraws = [...state.pendingWithdraws, payload.withdrawl]; 
                state.availableAmount = state.availableAmount - payload.withdrawl.amount ;
                state.pendingAmount = state.pendingAmount +payload.withdrawl.amount ;

            })
            .addCase(get_payment_request.fulfilled, (state, { payload }) => {
                state.pendingWithdraws = payload.withdrawalRequest;
              

            })
            .addCase(payment_request_confirm.pending, (state, { payload }) => {
                state.loader = true;
            
            })
            .addCase(payment_request_confirm.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            
            })
            .addCase(payment_request_confirm.fulfilled, (state, { payload }) => {
                const temp = state.pendingWithdraws.filter(r=>r._id!==payload.payment_id);
                state.loader = false;
                state.successMessage = payload.message;
                state.pendingWithdraws = temp;  

            
            })


    }

})


export const {messageClear} = paymentReducer.actions
export default paymentReducer.reducer