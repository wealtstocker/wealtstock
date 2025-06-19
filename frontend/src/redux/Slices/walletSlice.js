// src/redux/Slices/walletSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchWalletBalance = createAsyncThunk("wallet/fetchBalance", async () => {
  const res = await axiosInstance.get("/wallet/balance");
  return res.data.data;
});

export const fetchApprovedTrades = createAsyncThunk("wallet/fetchApprovedTrades", async () => {
  const res = await axiosInstance.get("/trade");
  const approvedTrades = res.data.filter((trade) => trade.status === "approved");
  return approvedTrades.length;
});

export const fetchWalletHistory = createAsyncThunk("wallet/fetchWalletHistory", async () => {
  const res = await axiosInstance.get("/wallet/wallet-history");
  return res.data.data;
});

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 0,
    approvedTrades: 0,
    walletHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchApprovedTrades.fulfilled, (state, action) => {
        state.approvedTrades = action.payload;
      })
      .addCase(fetchWalletHistory.fulfilled, (state, action) => {
        state.walletHistory = action.payload;
      });
  },
});

export default walletSlice.reducer;
