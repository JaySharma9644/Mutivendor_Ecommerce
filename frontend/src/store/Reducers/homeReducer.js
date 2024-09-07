import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
// eslint-disable-next-line no-undef
export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/get-categories`, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/get-products`, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const get_price_range_product = createAsyncThunk(
    'product/get_price_range_product',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/get-price-range-product`, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const query_products = createAsyncThunk(
    'product/query_products',
    async (query, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}`, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const homeReducer = createSlice({
    name: 'home',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categories: [],
        totalCategory: 0,
        products: [],
        latest_products:[],
        topRated_products:[],
        discount_products:[],
        totalProduct: 0,
        priceRange:{
            low:0,
            high:2000
        }
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(get_category.pending, (state, { payload }) => {
                state.loader = true;

            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.categories = payload.categories;
                state.totalCategory =payload.totalCategory;

            })
            .addCase(get_products.pending, (state, { payload }) => {
                state.loader = true;

            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.products = payload.products;
                state.latest_products =payload.latest_products;
                state.topRated_products =payload.topRated_products;
                state.discount_products =payload.discount_products;
                state.totalProduct =payload.totalProduct;

            })
            .addCase(get_price_range_product.pending, (state, { payload }) => {
                state.loader = true;

            })
            .addCase(get_price_range_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.latest_products =payload.latest_products;
                state.priceRange =payload.priceRange;
        
            })
            .addCase(query_products.pending, (state, { payload }) => {
                state.loader = true;

            })
            .addCase(query_products.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.products =payload.products;
                state.totalProduct =payload.totalProduct;
        
            })
    }
})




export default homeReducer.reducer;