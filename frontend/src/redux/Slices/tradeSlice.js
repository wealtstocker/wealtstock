import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchAllTrades = createAsyncThunk(
  'trade/fetchAll',
  async ({ navigate }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/trade/my');
      console.log('fetchAllTrades Response:', res);
      return res.data.trades;
    } catch (err) {
      console.error('fetchAllTrades Error:', err);
      if (err.response?.status === 403) {
        message.error('Session expired. Please login again.');
        navigate('/login');
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch trades');
    }
  }
);

export const fetchSingleTrade = createAsyncThunk(
  'trade/fetchOne',
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/trade/${id}`);
      console.log('fetchSingleTrade Response:', res);
      return res.data;
    } catch (err) {
      console.error('fetchSingleTrade Error:', err);
      if (err.response?.status === 403) {
        message.error('Unauthorized access. Redirecting to login.');
        navigate('/login');
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch trade');
    }
  }
);

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    all: [],
    single: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(fetchSingleTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tradeSlice.reducer;
