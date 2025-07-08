// ✅ fundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';

// Fetch all fund requests
export const fetchFundRequests = createAsyncThunk(
  'fund/fetchAll',
  async () => {
    const res = await axiosInstance.get('/wallet/admin/fund-requests');
    return res.data.data;
  }
);

// Approve a fund request
export const approveFundRequest = createAsyncThunk(
  'fund/approve',
  async ({ requestId, amount }) => {
    const res = await axiosInstance.post(`/wallet/approve-fund-request/${requestId}`, { amount });
    return { ...res.data, requestId };
  }
);

// Reject a fund request
export const rejectFundRequest = createAsyncThunk(
  'fund/reject',
  async (requestId) => {
    const res = await axiosInstance.post(`/wallet/reject-fund-request/${requestId}`);
    return { requestId };
  }
);

const fundSlice = createSlice({
  name: 'fund',
  initialState: {
    fundRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFundRequestApproved: (state, action) => {
      state.fundRequests = state.fundRequests.map((req) =>
        req.id === action.payload ? { ...req, status: 'successful' } : req
      );
    },
    setFundRequestRejected: (state, action) => {
      state.fundRequests = state.fundRequests.map((req) =>
        req.id === action.payload ? { ...req, status: 'rejected' } : req
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFundRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.fundRequests = action.payload;
      })
      .addCase(fetchFundRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(approveFundRequest.fulfilled, (state, action) => {
        state.fundRequests = state.fundRequests.map((req) =>
          req.id === action.payload.requestId ? { ...req, status: 'successful' } : req
        );
      })
      .addCase(rejectFundRequest.fulfilled, (state, action) => {
        state.fundRequests = state.fundRequests.map((req) =>
          req.id === action.payload.requestId ? { ...req, status: 'rejected' } : req
        );
      });
  },
});

export const { setFundRequestApproved, setFundRequestRejected } = fundSlice.actions;
export default fundSlice.reducer;
