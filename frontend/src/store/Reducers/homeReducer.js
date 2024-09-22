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

            const { data } = await api.get(`/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}
               &&searchValue=${query.searchValue ? query.searchValue : ''} `, { withCredentials: true })
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
export const product_details = createAsyncThunk(
    'product/product_details',
    async (slug, { rejectWithValue, fulfillWithValue }) => {
        try {

            const { data } = await api.get(`/home/product-details/${slug}`)
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const customer_review = createAsyncThunk(
    'review/customer_review',
    async(info, { fulfillWithValue }) => {
        try {
            const {data} = await api.post('/home/customer/submit-review',info)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.respone)
        }
    }
)

export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async({productId,pageNo}, { fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNo}`)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.respone)
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
        },
        product:{},
        relatedProducts:[],
        moreProducts:[],
        totalReview:0,
        rating_review:[],
        reviews:[]
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
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

            .addCase(product_details.rejected, (state, { payload }) => {
                state.loader = true;
                state.errorMessage=payload.error;

            })
            .addCase(product_details.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.product=payload.product;
                state.relatedProducts=payload.relatedProducts;
                state.moreProducts=payload.moreProducts;
        
            })
            .addCase(customer_review.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage=payload.message;
               
            })
            .addCase(get_reviews.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.totalReview =payload.totalReview;
                state.rating_review =payload.rating_review;
                state.reviews =payload.reviews;


              
        
            })
    }
})



export const {messageClear} = homeReducer.actions;

export default homeReducer.reducer;