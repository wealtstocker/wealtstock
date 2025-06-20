import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";

// Get all user balances
export const fetchAllBalances = createAsyncThunk("wallet/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/wallet/all-balances");
    return res.data.balances;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Fetch failed");
  }
});

// Top up or debit a wallet
export const updateWalletBalance = createAsyncThunk("wallet/update", async (payload, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/wallet/topup", payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balances: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload;
      })
      .addCase(fetchAllBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWalletBalance.fulfilled, (state, action) => {
        const { transaction_id, new_balance } = action.payload;
        const index = state.balances.findIndex((b) => b.customer_id === action.meta.arg.customerId);
        if (index !== -1) {
          state.balances[index].balance = new_balance;
        }
      });
  },
});

export default walletSlice.reducer;
