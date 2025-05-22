import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Async thunks
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/orders`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Siparişler yüklenirken bir hata oluştu');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Sipariş durumu güncellenirken bir hata oluştu');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        selectedOrder: null
    },
    reducers: {
        setSelectedOrder: (state, action) => {
            state.selectedOrder = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Update Order Status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export const { setSelectedOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer; 