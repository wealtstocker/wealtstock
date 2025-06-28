import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import customerReducer from './Slices/customerSlice';
import walletReducer from "./Slices/walletSlice";
import tradeReducer from './Slices/tradeSlice';
import fundReducer from './Slices/fundSlice';
import balanceReducer from './Slices/balanceSlice';
import siteConfigReducer from './Slices/siteConfigSlice';
import withdrawalReducer from "./Slices/withdrawalSlice";
import contactCallbackReducer from './Slices/contactCallbackSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    wallet: walletReducer,
    trade: tradeReducer,
    fund: fundReducer,
    balance: balanceReducer,
    siteConfig: siteConfigReducer,
    withdrawals: withdrawalReducer,
    contactCallback: contactCallbackReducer,
  },
});
