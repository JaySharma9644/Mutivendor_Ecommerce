import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// eslint-disable-next-line no-undef
export const get_customer_dashboard_data = createAsyncThunk(
    'dashboard/get_customer_dashboard_data',
    async (userId, { rejectWithValue, fulfillWithValue }) => {
      
        try {

              const { data } = await api.get(`/home/customer/get-customer-dashboard-data/${userId}`);
              return fulfillWithValue(data)
             
        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data)
        }
    }
)


export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState: {
        myOrders: [],
        successMessage: '',
        errorMessage: '',
        myOrder: {},
        loader: false,
        totalOrders:0,
        pendingOrders:0,
        cancelledOrders:0,
        recentOrders:[]

    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_customer_dashboard_data.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(get_customer_dashboard_data.rejected, (state, { payload }) => {
                state.loader = false;

            })
            .addCase(get_customer_dashboard_data.fulfilled, (state, { payload }) => {
              
                state.loader = false;
                state.totalOrders = payload.totalOrders;
                state.pendingOrders = payload.pendingOrders;
                state.cancelledOrders = payload.cancelledOrders;
                state.recentOrders = payload.recentOrders;

            })





    }
})



export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;