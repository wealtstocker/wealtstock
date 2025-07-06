import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import Toast from '../../services/toast';

// Fetch all user balances
export const fetchAllBalances = createAsyncThunk(
  'wallet/fetchAllBalances',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/wallet/all-balances');
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Failed to fetch balances');
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// Top up or debit a wallet
export const updateWalletBalance = createAsyncThunk(
  'wallet/updateWalletBalance',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/wallet/admin/topup', payload);
      Toast.success(res.data.message || `Wallet ${payload.type} successful`);
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Wallet update failed');
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// Fetch all transactions
export const fetchAllTransactions = createAsyncThunk(
  'wallet/fetchAllTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/wallet/all-transactions');
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Failed to fetch transactions');
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// Fetch all fund requests
export const fetchAllFundRequests = createAsyncThunk(
  'wallet/fetchAllFundRequests',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/wallet/admin/fund-requests');
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Failed to fetch fund requests');
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// Fetch all withdrawals
export const fetchAllWithdrawals = createAsyncThunk(
  'wallet/fetchAllWithdrawals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/wallet/all-withdrawals');
      console.log(res)
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Failed to fetch withdrawals');
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

// Approve fund request
export const approveFundRequest = createAsyncThunk(
  'wallet/approveFundRequest',
  async ({ requestId, amount }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/wallet/approve-fund-request/${requestId}`, { amount });
      Toast.success(res.data.message || 'Fund request approved');
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Failed to approve fund request');
      return rejectWithValue(err.response?.data?.message || 'Approval failed');
    }
  }
);

// Reject fund request
export const rejectFundRequest = createAsyncThunk(
  'wallet/rejectFundRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/wallet/reject-fund-request/${requestId}`);
      Toast.success(res.data.message || 'Fund request rejected');
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || 'Failed to reject fund request');
      return rejectWithValue(err.response?.data?.message || 'Rejection failed');
    }
  }
);

// Update withdrawal status
export const updateWithdrawalStatus = createAsyncThunk(
  'wallet/updateWithdrawalStatus',
  async ({ withdrawal_id, action }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch('/wallet/withdrawal/status', { withdrawal_id, action });
      Toast.success(res.data.message || `Withdrawal ${action} successful`);
      return res.data.data;
    } catch (err) {
      Toast.error(err.response?.data?.message || `Failed to ${action} withdrawal`);
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balances: [],
    transactions: [],
    fundRequests: [],
    withdrawals: [],
    loadingBalances: false,
    loadingTransactions: false,
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
      // Fetch Balances
      .addCase(fetchAllBalances.pending, (state) => {
        state.loadingBalances = true;
        state.error = null;
      })
      .addCase(fetchAllBalances.fulfilled, (state, action) => {
        state.loadingBalances = false;
        state.balances = action.payload;
      })
      .addCase(fetchAllBalances.rejected, (state, action) => {
        state.loadingBalances = false;
        state.error = action.payload;
      })
      // Update Wallet Balance
      .addCase(updateWalletBalance.fulfilled, (state, action) => {
        const { new_balance, customerId } = action.payload;
        const index = state.balances.findIndex((b) => b.customer_id === customerId);
        if (index !== -1) {
          state.balances[index].balance = new_balance;
        }
      })
      .addCase(updateWalletBalance.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loadingTransactions = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loadingTransactions = false;
        state.transactions = action.payload;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loadingTransactions = false;
        state.error = action.payload;
      })
      // Fetch Fund Requests
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
      // Fetch Withdrawals
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
      // Approve Fund Request
      .addCase(approveFundRequest.fulfilled, (state, action) => {
        const { request_id, new_balance, customer_id } = action.payload;
        const index = state.fundRequests.findIndex((fr) => fr.id === request_id);
        if (index !== -1) {
          state.fundRequests[index].status = 'successful';
        }
        const balanceIndex = state.balances.findIndex((b) => b.customer_id === customer_id);
        if (balanceIndex !== -1) {
          state.balances[balanceIndex].balance = new_balance;
        }
      })
      .addCase(approveFundRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reject Fund Request
      .addCase(rejectFundRequest.fulfilled, (state, action) => {
        const { request_id } = action.payload;
        const index = state.fundRequests.findIndex((fr) => fr.id === request_id);
        if (index !== -1) {
          state.fundRequests[index].status = 'rejected';
        }
      })
      .addCase(rejectFundRequest.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Withdrawal Status
      .addCase(updateWithdrawalStatus.fulfilled, (state, action) => {
        const { withdrawal_id, new_balance, action: status } = action.payload;
        const index = state.withdrawals.findIndex((wd) => wd.withdrawal_id === withdrawal_id);
        if (index !== -1) {
          state.withdrawals[index].status = status;
          if (new_balance && status === 'approve') {
            const balanceIndex = state.balances.findIndex((b) => b.customer_id === state.withdrawals[index].customer_id);
            if (balanceIndex !== -1) {
              state.balances[balanceIndex].balance = new_balance;
            }
          }
        }
      })
      .addCase(updateWithdrawalStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;