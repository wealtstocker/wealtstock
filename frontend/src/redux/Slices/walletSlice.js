import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { message } from 'antd';



export const fetchAllFundRequests = createAsyncThunk(
  'wallet/fetchAllFundRequests',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/wallet/admin/fund-requests');
      console.log("---------------",res)
      return res.data.data;
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch fund requests');
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);


export const fetchAllWithdrawals = createAsyncThunk(
  'wallet/fetchAllWithdrawals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/wallet/all-withdrawals');
      console.log("-----------all-withdrawals----",res)
      return res.data.data;
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch withdrawals');
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);


export const fetchWalletBalance = createAsyncThunk(
  "wallet/fetchWalletBalance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/wallet/balance");
      return res.data.data.balance;
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch balance");
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchApprovedTrades = createAsyncThunk(
  "wallet/fetchApprovedTrades",
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/trade/my?customer_id=${customerId}`);
      console.log("-------fetchApprovedTrades--------",res)
      return res.data.trades.filter((trade) => trade.status === "approved").length;
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch trades");
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchWalletHistory = createAsyncThunk(
  "wallet/fetchWalletHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/wallet/wallet-history");
      console.log("-------fetchwallet hitory--------",res)
      return res.data.data;
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to fetch wallet history");
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const requestFund = createAsyncThunk(
  "wallet/requestFund",
  async ({ amount, method, utr_number, note, screenshot }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("method", method);
      formData.append("utr_number", utr_number);
      formData.append("note", note);
      if (screenshot) formData.append("screenshot", screenshot);
      const res = await axiosInstance.post("/wallet/fund-request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success(res.data.message || "Fund request submitted");
      return res.data.data;
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to submit fund request");
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  "wallet/requestWithdrawal",
  async ({ amount, method }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/wallet/withdraw", { amount, method });
      console.log("---------------",res)
      message.success(res.data.message || "Withdrawal request submitted");
      return res.data.data;
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to submit withdrawal request");
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balances: [],
    fundRequests: [],
    withdrawals: [],
    balance: 0,
    approvedTrades: 0,
    walletHistory: [],
    loading: false,
    loadingBalances: false,
    loadingFundRequests: false,
    loadingWithdrawals: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAllFundRequests.pending, (state) => {
        state.loadingFundRequests = true;
        state.error = null;
      })
      .addCase(fetchAllFundRequests.fulfilled, (state, action) => {
        state.loadingFundRequests = false;
        state.fundRequests = action.payload;
      })
      .addCase(fetchAllFundRequests.rejected, (state, action) => {
        state.loadingFundRequests = false;
        state.error = action.payload;
      })
      .addCase(fetchAllWithdrawals.pending, (state) => {
        state.loadingWithdrawals = true;
        state.error = null;
      })
      .addCase(fetchAllWithdrawals.fulfilled, (state, action) => {
        state.loadingWithdrawals = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchAllWithdrawals.rejected, (state, action) => {
        state.loadingWithdrawals = false;
        state.error = action.payload;
      })
      
      
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
        state.error = action.payload;
      })
      .addCase(fetchApprovedTrades.fulfilled, (state, action) => {
        state.approvedTrades = action.payload;
      })
      .addCase(fetchApprovedTrades.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchWalletHistory.fulfilled, (state, action) => {
        state.walletHistory = action.payload;
      })
      .addCase(fetchWalletHistory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(requestFund.fulfilled, (state, action) => {
        state.walletHistory.push(action.payload);
      })
      .addCase(requestFund.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.walletHistory.push(action.payload);
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;