import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';

// ✅ Fetch all fund requests for admin
export const fetchFundRequests = createAsyncThunk(
  'fund/fetchAll',
  async () => {
    const res = await axiosInstance.get('/wallet/admin/fund-requests');
    // console.log("-----",res)
    return res.data.data;
  }
);

// ✅ Approve a fund request
export const approveFundRequest = createAsyncThunk(
  'fund/approve',
  async (requestId) => {
    const res = await axiosInstance.post(`/wallet/approve-fund-request/${requestId}`);
    console.log(res)
    return { ...res.data, requestId };
  }
);

const fundSlice = createSlice({
  name: 'fund',
  initialState: {
    fundRequests: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
        const updatedList = state.fundRequests.map((req) =>
          req.id === action.payload.requestId
            ? { ...req, status: 'successful' }
            : req
        );
        state.fundRequests = updatedList;
      });
  },
});

export default fundSlice.reducer;
