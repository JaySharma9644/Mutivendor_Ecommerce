import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
// eslint-disable-next-line no-undef
export const add_friend = createAsyncThunk(
    'chat/add_friend',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.post('/chat/customer/add-customer-friend', info)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)


export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.post('/chat/customer/send-message-to-seller', info)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)



export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        myFriends:{},
        fb_messages:[],
        current_Fd:"",
        successMessage: '',
        errorMessage: '',
        
    },
    reducers: {
        messageClear :(state,_)=>{
            state.errorMessage ="";
            state.successMessage ="";
        },
        updateMessage:(state,{payload})=>{
            state.fb_messages =[...state.fb_messages,payload]
           
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_friend.fulfilled, (state, { payload }) => {
                state.fb_messages = payload.messages;
                state.current_Fd = payload.currentFd;
                state.myFriends =payload.MyFriends;
            
            })
            .addCase(send_message.fulfilled, (state, { payload }) => {
                let tempFriends = state.myFriends
                let index = tempFriends.findIndex(f=>f.fdId===payload.message.receiverId);
                if(index>0){
                    let temp = tempFriends[index] ;
                    tempFriends[index] =   tempFriends[index-1];
                    tempFriends[index-1] =temp;
                    index --;
                }
                state.myFriends = tempFriends;
                state.fb_messages = [...state.fb_messages,payload.message];
                state.successMessage ='Message Sent Success';
            
            })

             
    }
})



export const {messageClear,updateMessage} = chatReducer.actions;
export default chatReducer.reducer;