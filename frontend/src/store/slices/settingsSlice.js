import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Async thunks
export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/settings`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Ayarlar yüklenirken bir hata oluştu');
        }
    }
);

export const updateSettings = createAsyncThunk(
    'settings/updateSettings',
    async (settingsData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/settings`, settingsData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Ayarlar güncellenirken bir hata oluştu');
        }
    }
);

export const testConnection = createAsyncThunk(
    'settings/testConnection',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/settings/test-connection`, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Bağlantı testi sırasında bir hata oluştu');
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
        testStatus: 'idle',
        testError: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.testError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Settings
            .addCase(fetchSettings.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Update Settings
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            // Test Connection
            .addCase(testConnection.pending, (state) => {
                state.testStatus = 'loading';
                state.testError = null;
            })
            .addCase(testConnection.fulfilled, (state) => {
                state.testStatus = 'succeeded';
            })
            .addCase(testConnection.rejected, (state, action) => {
                state.testStatus = 'failed';
                state.testError = action.payload;
            });
    }
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer; 