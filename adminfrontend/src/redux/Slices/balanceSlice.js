// walletSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';

// --- Fetch all transactions ---
export const fetchAllTransactions = createAsyncThunk(
  'wallet/fetchAllTransactions',
  async () => {
    const res = await axiosInstance.get('/wallet/all-transactions');
    return res.data.transactions;
  }
);

// --- Fetch all balances ---
export const fetchAllBalances = createAsyncThunk(
  'wallet/fetchAllBalances',
  async () => {
    const res = await axiosInstance.get('/wallet/all-balances');
    return res.data.balances;
  }
);

const balanceSlice = createSlice({
  name: 'wallet',
  initialState: {
    transactions: [],
    balances: [],
    loadingTransactions: false,
    loadingBalances: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loadingTransactions = true;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loadingTransactions = false;
      })
      .addCase(fetchAllTransactions.rejected, (state) => {
        state.loadingTransactions = false;
      })

      // Balances
      .addCase(fetchAllBalances.pending, (state) => {
        state.loadingBalances = true;
      })
      .addCase(fetchAllBalances.fulfilled, (state, action) => {
        state.balances = action.payload;
        state.loadingBalances = false;
      })
      .addCase(fetchAllBalances.rejected, (state) => {
        state.loadingBalances = false;
      });
  },
});

export default balanceSlice.reducer;
