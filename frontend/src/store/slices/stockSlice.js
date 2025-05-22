import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const fetchStock = createAsyncThunk(
  'stock/fetchStock',
  async () => {
    const response = await axios.get(`${API_URL}/api/stock`);
    return response.data;
  }
);

export const updateStock = createAsyncThunk(
  'stock/updateStock',
  async ({ productId, quantity }) => {
    const response = await axios.put(`${API_URL}/api/stock/${productId}`, { quantity });
    return response.data;
  }
);

export const bulkUpdateStock = createAsyncThunk(
  'stock/bulkUpdateStock',
  async (updates) => {
    const response = await axios.post(`${API_URL}/api/stock/bulk`, { updates });
    return response.data;
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStock.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(bulkUpdateStock.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default stockSlice.reducer; 