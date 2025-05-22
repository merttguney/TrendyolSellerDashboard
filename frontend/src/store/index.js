import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import stockReducer from './slices/stockSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    stock: stockReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 