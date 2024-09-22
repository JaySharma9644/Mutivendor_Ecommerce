import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// eslint-disable-next-line no-undef
export const place_order = createAsyncThunk(
    'cart/place_order',
    async ({ price, products, shipping_fee, items, shippingInfo, userId, navigate }, { rejectWithValue, fulfillWithValue }) => {

        try {

            const { data } = await api.post('/home/order/place-order', { price, products, shipping_fee, items, shippingInfo, userId, navigate });
            console.log(data)
            navigate('/payment', {
                state: {
                    price: price + shipping_fee,
                    items,
                    orderId: data.orderId
                }
            })


        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({ customerId,status }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customers/get-orders/${customerId}/${status}`);
            return fulfillWithValue(data)

        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data)
        }
    }


)
export const get_order_details = createAsyncThunk(
    'order/get_order_details',
    async (orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/home/customers/get-order-details/${orderId}`);
            return fulfillWithValue(data)

        } catch (error) {
            console.log(error.response)
            return rejectWithValue(error.response.data)
        }
    }


)


export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        successMessage: '',
        errorMessage: '',
        myOrder: {},
        loader: false


    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(place_order.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(place_order.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;

            })
            .addCase(place_order.fulfilled, (state, { payload }) => {
                state.loader = false;

            })
            .addCase(get_orders.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.myOrders =payload.orders;
            })
            .addCase(get_order_details.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.myOrder =payload.order ;
            })






    }
})



export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;