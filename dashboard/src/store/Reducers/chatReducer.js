import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_customers = createAsyncThunk(
    'chat/get_customers',
    async (sellerId,{rejectWithValue,fulfillWithValue}) => {
    
        try {
            const { data } = await api.get(`/chat/seller/get-customers/${sellerId}`
                ,{ withCredentials: true })
                return fulfillWithValue(data);
           
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const get_customer_message = createAsyncThunk(
    'chat/get_customer_message',
    async (customerId,{rejectWithValue,fulfillWithValue}) => {
    
        try {
            const { data } = await api.get(`/chat/seller/get-customer-message/${customerId}`
                ,{ withCredentials: true })
                return fulfillWithValue(data);
           
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info,{rejectWithValue,fulfillWithValue}) => {
    
        try {
            const { data } = await api.post('/chat/seller/send-message-to-customer',info
                ,{ withCredentials: true })
                return fulfillWithValue(data);
           
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
export const get_sellers = createAsyncThunk(
    'chat/get_sellers',
    async (_,{rejectWithValue,fulfillWithValue}) => {
    
        try {
            const { data } = await api.get('/chat/admin/get-sellers'
                ,{ withCredentials: true })
                return fulfillWithValue(data);
           
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)



export const chatReducer = createSlice({
    name: 'sellerChat',
    initialState: {
        successMessage: '',
        errorMessage: '',
        customers:[],
        messages:[],
        activeCustomer:[],
        activeSeller:[],
        activeAdmin:"",
        friends:[],
        seller_admin_message:[],
        currentSeller:{},
        currentCustomer:{},
        sellers: []

    },
    reducers: {
        messageClear:(state,_)=>{
            state.errorMessage="";
            state.successMessage="";
        },
        updateMessage:(state,{payload}) =>{
          
            state.messages =[...state.messages,payload];
        },
        update_sellers:(state,{payload}) =>{
          
            state.activeSeller =payload;

        },
        update_customers:(state,{payload}) =>{
          
            state.activeCustomer =payload;

        }


    },
    extraReducers: (builder) => {
        builder.addCase(get_customers.fulfilled,(state,{payload})=>{
           
            state.customers=payload.customers;
        })
        builder.addCase(get_customer_message.fulfilled,(state,{payload})=>{
           
            state.messages=payload.messages;

            
            state.currentCustomer=payload.currentCustomer;
        })
        .addCase(send_message.rejected, (state, { payload }) => {

            state.errorMessage=payload.messages;
        })
        .addCase(send_message.fulfilled, (state, { payload }) => {
            let tempFriends = state.customers
            let index = tempFriends.findIndex(f=>f.fdId===payload.message.receiverId);
            if(index>0){
                let temp = tempFriends[index] ;
                tempFriends[index] =   tempFriends[index-1];
                tempFriends[index-1] =temp;
                index --;
            }
            state.customers = tempFriends;
            state.messages = [...state.messages,payload.message];
            state.successMessage ='Message Sent';
        
        })
        .addCase(get_sellers.fulfilled, (state, { payload }) => {
            state.sellers = payload.sellers ;
           
        })


       
    }
})

export const {messageClear,updateMessage,update_sellers,update_customers} = chatReducer.actions;
export default chatReducer.reducer