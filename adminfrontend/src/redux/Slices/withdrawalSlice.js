
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';

export const fetchAllWithdrawals = createAsyncThunk(
  'withdrawals/fetchAll',
  async (status, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/wallet/all-withdrawals`);
      // console.log(res)
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch withdrawals');
    }
  }
);

export const updateWithdrawalStatus = createAsyncThunk(
  'withdrawals/updateStatus',
  async ({ withdrawal_id, action }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/withdrawals/${withdrawal_id}`, { action });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Failed to ${action} withdrawal`);
    }
  }
);

const withdrawalSlice = createSlice({
  name: 'withdrawals',
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWithdrawals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWithdrawalStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWithdrawalStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((item) =>
          item.withdrawal_id === action.payload.withdrawal_id ? action.payload : item
        );
      })
      .addCase(updateWithdrawalStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default withdrawalSlice.reducer;