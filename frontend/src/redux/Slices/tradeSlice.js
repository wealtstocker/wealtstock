import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchAllTrades = createAsyncThunk('trade/fetchAll', async () => {
  const res = await axiosInstance.get('/trade/my');
  return res.data.data;
});

export const fetchSingleTrade = createAsyncThunk('trade/fetchOne', async (id) => {
  const res = await axiosInstance.get(`/trade/${id}`);
  return res.data;
});

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
      })
      .addCase(fetchAllTrades.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllTrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSingleTrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(fetchSingleTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tradeSlice.reducer;
