import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import customerReducer from './Slices/customerSlice';
import walletReducer from "./Slices/walletSlice";
import tradeReducer from './Slices/tradeSlice';
import siteConfigReducer from './Slices/siteConfigSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    wallet: walletReducer,
    trade: tradeReducer,
    siteConfig: siteConfigReducer,
  },
});
