import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    }
);

export const syncProducts = createAsyncThunk(
    'products/syncProducts',
    async () => {
        const response = await axios.post(`${API_URL}/products/sync`);
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, product }) => {
        const response = await axios.put(`${API_URL}/products/${id}`, product);
        return response.data;
    }
);

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (product) => {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    }
);

const initialState = {
    items: [],
    status: 'idle',
    error: null,
    loading: false
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.loading = false;
            })
            // Sync Products
            .addCase(syncProducts.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(syncProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(syncProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.loading = false;
            })
            // Add Product
            .addCase(addProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update Product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export default productsSlice.reducer; 