import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// eslint-disable-next-line no-undef
export const add_to_cart = createAsyncThunk(
    'cart/add_to_cart',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.post('/home/product/add-to-cart', info)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_cart_products = createAsyncThunk(
    'cart/get_cat_products',
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/product/get-cart-products/${userId}`)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const delete_cart_products = createAsyncThunk(
    'cart/delete_cart_products',
    async (cartId, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/product/delete_cart_products/${cartId}`)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const cart_quantity_increment = createAsyncThunk(
    'cart/cart_quantity_increment',
    async (cartId, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.put(`/home/product/cart_quantity_increment/${cartId}`)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const cart_quantity_decrement = createAsyncThunk(
    'cart/cart_quantity_decrement',
    async (cartId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/home/product/cart_quantity_decrement/${cartId}`)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)





export const cartReducer = createSlice({
    name: 'cart',
    initialState: {
        cart_products: [],
        cart_product_count: 0,
        whistlist_count: 0,
        price: 0,
        successMessage: '',
        errorMessage: '',
        shipping_fee: 0,
        outofstock_products: [],
        buy_product_item:0

    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_to_cart.rejected, (state, { payload }) => {
                state.errorMessage = payload.error;

            })
            .addCase(add_to_cart.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;
                state.cart_product_count = state.cart_product_count + 1

            })
           
            .addCase(get_cart_products.fulfilled, (state, { payload }) => {
                state.cart_products = payload?.cart_products;
                state.cart_product_count = payload?.cart_product_count;
                state.price = payload?.price;
                state.shipping_fee = payload?.shipping_fee;
                state.outofstock_products = payload?.outofstock_products;
                state.buy_product_item = payload?.buy_product_item;

                
            })
            .addCase(delete_cart_products.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;

            })
            .addCase(cart_quantity_increment.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;

            })
            .addCase(cart_quantity_decrement.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.loader = false;

            })




    }
})



export const { messageClear } = cartReducer.actions;
export default cartReducer.reducer;